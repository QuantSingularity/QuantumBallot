/**
 * Comprehensive test suite for the blockchain module
 */
const BlockChain = require("../src/core/blockchain").default;
const SmartContract = require("../src/smart_contract/smart_contract").default;
const leveldb = require("../src/leveldb");

jest.mock("../src/smart_contract/smart_contract", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    update: jest.fn(),
    isValidElectionTime: jest.fn().mockReturnValue(true),
    getVoters: jest.fn().mockResolvedValue([]),
    getCandidates: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock("../src/leveldb", () => ({
  readChain: jest.fn().mockResolvedValue([]),
  writeChain: jest.fn().mockResolvedValue(undefined),
  clearChains: jest.fn().mockResolvedValue([]),
  updateVoter: jest.fn().mockResolvedValue(undefined),
  deployVotersGenerated: jest.fn().mockResolvedValue([]),
  deployCandidates: jest.fn().mockResolvedValue([]),
  readVoterCitizenRelation: jest.fn().mockResolvedValue("test-identifier"),
}));

describe("BlockChain", () => {
  let blockchain;

  beforeEach(() => {
    jest.clearAllMocks();
    blockchain = new BlockChain();
  });

  describe("Constructor and Initialization", () => {
    test("should initialize with a single genesis block", () => {
      expect(blockchain.chain).toHaveLength(1);
      expect(blockchain.chain[0].blockIndex).toBe(0);
      expect(blockchain.transactionPool).toEqual([]);
    });

    test("should instantiate the smart contract", () => {
      expect(SmartContract).toHaveBeenCalled();
    });

    test("should log and recover when smart contract initialization throws", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      SmartContract.mockImplementationOnce(() => {
        throw new Error("SC init error");
      });
      const bc = new BlockChain();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error initializing smart contract:",
        expect.objectContaining({ message: "SC init error" }),
      );
      expect(bc.chain).toHaveLength(1);
      consoleSpy.mockRestore();
    });
  });

  describe("Chain Management", () => {
    test("setNodeAddress should assign address and load chain", async () => {
      await blockchain.setNodeAddress("test-node");
      expect(blockchain.nodeAddress).toBe("test-node");
      expect(leveldb.readChain).toHaveBeenCalled();
    });

    test("loadChain should replace chain when storage returns a non-empty array", async () => {
      const stored = [
        { blockIndex: 0, blockHeader: { blockHash: "-" } },
        { blockIndex: 1, blockHeader: { blockHash: "abc" } },
      ];
      leveldb.readChain.mockResolvedValueOnce(stored);
      await blockchain.loadChain();
      expect(blockchain.chain).toEqual(stored);
    });

    test("loadChain should not replace chain when storage returns empty array", async () => {
      leveldb.readChain.mockResolvedValueOnce([]);
      const originalChain = [...blockchain.chain];
      await blockchain.loadChain();
      expect(blockchain.chain).toEqual(originalChain);
    });

    test("loadChain should log error and keep chain on failure", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      leveldb.readChain.mockRejectedValueOnce(new Error("Chain loading error"));
      await blockchain.loadChain();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error loading chain:",
        expect.objectContaining({ message: "Chain loading error" }),
      );
      consoleSpy.mockRestore();
    });

    test("clearChainsFromStorage should reset state and call clearChains", async () => {
      await blockchain.clearChainsFromStorage();
      expect(leveldb.clearChains).toHaveBeenCalled();
      expect(blockchain.chain).toHaveLength(1);
      expect(blockchain.transactionPool).toEqual([]);
    });

    test("saveChain should call writeChain with current chain", () => {
      blockchain.saveChain();
      expect(leveldb.writeChain).toHaveBeenCalledWith(blockchain.chain);
    });

    test("saveChain should log error when writeChain throws", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      leveldb.writeChain.mockImplementationOnce(() => {
        throw new Error("Write error");
      });
      blockchain.saveChain();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving chain:",
        expect.objectContaining({ message: "Write error" }),
      );
      consoleSpy.mockRestore();
    });
  });

  describe("Block Accessors", () => {
    test("getGenesisBlock should return block with index 0 and previousHash '-'", () => {
      const genesis = blockchain.getGenesisBlock();
      expect(genesis.blockIndex).toBe(0);
      expect(genesis.blockHeader.previousBlockHash).toBe("-");
    });

    test("getChain should return the chain array", () => {
      expect(blockchain.getChain()).toEqual(blockchain.chain);
    });

    test("getLengthChain should return 1 for a fresh chain", () => {
      expect(blockchain.getLengthChain()).toBe(1);
    });

    test("getBlocks should return formatted block summaries", () => {
      const blocks = blockchain.getBlocks();
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks).toHaveLength(1);
      const b = blocks[0];
      expect(b).toHaveProperty("id", 1);
      expect(b).toHaveProperty("hashBlock");
      expect(b).toHaveProperty("nonce");
      expect(b).toHaveProperty("numOfTransactions");
      expect(b).toHaveProperty("dateAndTime");
      expect(b).toHaveProperty("size");
    });

    test("getTransactions should return all transactions across all blocks", () => {
      const txs = blockchain.getTransactions();
      expect(Array.isArray(txs)).toBe(true);
      expect(txs.length).toBe(2);
      txs.forEach((tx) => {
        expect(tx).toHaveProperty("id");
        expect(tx).toHaveProperty("transactionHash");
        expect(tx).toHaveProperty("identifier");
      });
    });

    test("getPendingTransactions should return empty array initially", () => {
      expect(blockchain.getPendingTransactions()).toEqual([]);
    });

    test("getBlockDetails should find a block by its hash", () => {
      const genesisHash = blockchain.chain[0].blockHeader.blockHash;
      const found = blockchain.getBlockDetails(genesisHash);
      expect(found).toBeDefined();
      expect(found.blockIndex).toBe(0);
    });

    test("getBlockDetails should return undefined for unknown hash", () => {
      expect(blockchain.getBlockDetails("nonexistent-hash")).toBeUndefined();
    });
  });

  describe("replaceChain", () => {
    test("should replace chain when new chain is longer and valid", () => {
      jest.spyOn(blockchain, "isValidChain").mockReturnValueOnce(true);
      const newChain = [{ blockIndex: 0 }, { blockIndex: 1 }];
      const result = blockchain.replaceChain(newChain);
      expect(result).toBe(true);
      expect(blockchain.chain).toEqual(newChain);
    });

    test("should reject chain that is invalid", () => {
      jest.spyOn(blockchain, "isValidChain").mockReturnValueOnce(false);
      const original = [...blockchain.chain];
      const result = blockchain.replaceChain([
        { blockIndex: 0 },
        { blockIndex: 1 },
      ]);
      expect(result).toBe(false);
      expect(blockchain.chain).toEqual(original);
    });

    test("should reject chain that is not longer than current", () => {
      jest.spyOn(blockchain, "isValidChain").mockReturnValueOnce(true);
      const result = blockchain.replaceChain([{ blockIndex: 0 }]);
      expect(result).toBe(false);
    });
  });

  describe("addBlock", () => {
    test("should add a valid block and update voters + smart contract", () => {
      jest.spyOn(blockchain, "isValidBlock").mockReturnValueOnce(true);
      const block = {
        blockIndex: 1,
        blockHeader: { blockHash: "abc123" },
        transactions: [{ data: { identifier: "voter-id" } }],
      };
      const result = blockchain.addBlock(block);
      expect(result).toBe(true);
      expect(blockchain.chain).toHaveLength(2);
      expect(blockchain.transactionPool).toEqual([]);
      expect(blockchain.smartContract.update).toHaveBeenCalled();
      expect(leveldb.updateVoter).toHaveBeenCalledWith("voter-id", {
        identifier: "voter-id",
      });
    });

    test("should reject an invalid block", () => {
      jest.spyOn(blockchain, "isValidBlock").mockReturnValueOnce(false);
      const originalLen = blockchain.chain.length;
      const result = blockchain.addBlock({ blockIndex: 1 });
      expect(result).toBe(false);
      expect(blockchain.chain).toHaveLength(originalLen);
    });

    test("should return false and log error when isValidBlock throws", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      jest.spyOn(blockchain, "isValidBlock").mockImplementationOnce(() => {
        throw new Error("Validation error");
      });
      const result = blockchain.addBlock({ blockIndex: 1 });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error adding block:",
        expect.objectContaining({ message: "Validation error" }),
      );
      consoleSpy.mockRestore();
    });
  });

  describe("addPendingTransaction", () => {
    test("should add a valid transaction to the pool", () => {
      jest.spyOn(blockchain, "isValidTransaction").mockReturnValueOnce(true);
      const tx = blockchain.addPendingTransaction(
        "valid-id-123456",
        "electoral-id",
        "iv",
        "choice",
        "choice-iv",
        "secret",
      );
      expect(tx).not.toBeNull();
      expect(blockchain.transactionPool).toHaveLength(1);
    });

    test("should return null and skip pool when transaction is invalid", () => {
      jest.spyOn(blockchain, "isValidTransaction").mockReturnValueOnce(false);
      const tx = blockchain.addPendingTransaction(
        "id",
        "electoral-id",
        "iv",
        "choice",
        "choice-iv",
        "secret",
      );
      expect(tx).toBeNull();
      expect(blockchain.transactionPool).toHaveLength(0);
    });

    test("should return null when election time is invalid", () => {
      blockchain.smartContract.isValidElectionTime.mockReturnValueOnce(false);
      const tx = blockchain.addPendingTransaction(
        "valid-id-123456",
        "electoral-id",
        "iv",
        "choice",
        "choice-iv",
        "secret",
      );
      expect(tx).toBeNull();
    });

    test("should return null when smartContract is missing", () => {
      blockchain.smartContract = null;
      const tx = blockchain.addPendingTransaction(
        "valid-id-123456",
        "electoral-id",
        "iv",
        "choice",
        "choice-iv",
        "secret",
      );
      expect(tx).toBeNull();
    });
  });

  describe("hashData and hashBlock", () => {
    test("hashData should return a 64-char hex string", () => {
      expect(blockchain.hashData("hello world")).toMatch(/^[0-9a-fA-F]{64}$/);
    });

    test("hashData should be deterministic", () => {
      expect(blockchain.hashData("abc")).toBe(blockchain.hashData("abc"));
    });

    test("hashBlock should return a 64-char hex string", () => {
      expect(blockchain.hashBlock("prevHash", "merkleRoot", 42)).toMatch(
        /^[0-9a-fA-F]{64}$/,
      );
    });

    test("hashBlock with different nonces should produce different hashes", () => {
      expect(blockchain.hashBlock("prev", "root", 0)).not.toBe(
        blockchain.hashBlock("prev", "root", 1),
      );
    });
  });

  describe("isSHA256", () => {
    test("should return true for a valid 64-char hex string", () => {
      expect(blockchain.isSHA256("0".repeat(64))).toBe(true);
    });
    test("should return false for strings that are too short", () => {
      expect(blockchain.isSHA256("abc")).toBe(false);
    });
    test("should return false for strings with non-hex chars", () => {
      expect(blockchain.isSHA256("g".repeat(64))).toBe(false);
    });
    test("should return false for empty string", () => {
      expect(blockchain.isSHA256("")).toBe(false);
    });
  });

  describe("isValidVote", () => {
    test("should validate a well-formed vote", () => {
      expect(
        blockchain.isValidVote({
          identifier: "validid-123456",
          choiceCode: "X",
          secret: "s",
        }),
      ).toBe(true);
    });
    test("should reject vote where identifier is too short (≤5 chars)", () => {
      expect(
        blockchain.isValidVote({
          identifier: "short",
          choiceCode: "X",
          secret: "s",
        }),
      ).toBe(false);
    });
    test("should reject vote with empty choiceCode", () => {
      expect(
        blockchain.isValidVote({
          identifier: "valid-id-123456",
          choiceCode: "",
          secret: "s",
        }),
      ).toBe(false);
    });
    test("should reject vote with empty secret", () => {
      expect(
        blockchain.isValidVote({
          identifier: "valid-id-123456",
          choiceCode: "X",
          secret: "",
        }),
      ).toBe(false);
    });
  });

  describe("isValidTransactionPool", () => {
    test("should return false for an empty array", () => {
      expect(blockchain.isValidTransactionPool([])).toBe(false);
    });
    test("should return false for null/undefined", () => {
      expect(blockchain.isValidTransactionPool(null)).toBe(false);
    });
    test("should return false when any transaction is invalid", () => {
      jest
        .spyOn(blockchain, "isValidTransaction")
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      const result = blockchain.isValidTransactionPool([
        {
          transactionHash: "a",
          data: {
            identifier: "id1",
            choiceCode: "c",
            secret: "s",
            state: true,
          },
        },
        {
          transactionHash: "b",
          data: {
            identifier: "id2",
            choiceCode: "c",
            secret: "s",
            state: true,
          },
        },
      ]);
      expect(result).toBe(false);
    });
  });

  describe("isValidChain", () => {
    test("should return false for null or empty chain", () => {
      expect(blockchain.isValidChain(null)).toBe(false);
      expect(blockchain.isValidChain([])).toBe(false);
    });
    test("should return false when genesis block does not match", () => {
      const tampered = [{ ...blockchain.getGenesisBlock(), blockIndex: 99 }];
      expect(blockchain.isValidChain(tampered)).toBe(false);
    });
    test("should return true for a fresh single-block chain", () => {
      expect(blockchain.isValidChain([blockchain.getGenesisBlock()])).toBe(
        true,
      );
    });
  });

  describe("Encryption wrappers", () => {
    test("encryptDataIdentifier / decryptDataIdentifier should round-trip", () => {
      const data = "electoral-id-value";
      const enc = blockchain.encryptDataIdentifier(data);
      expect(enc).toHaveProperty("IV");
      expect(enc).toHaveProperty("CIPHER_TEXT");
      expect(blockchain.decryptDataIdentifier(enc)).toBe(data);
    });

    test("encryptDataVoter / decryptDataVoter should round-trip", () => {
      const data = "vote-choice-code";
      const enc = blockchain.encryptDataVoter(data);
      expect(enc).toHaveProperty("IV");
      expect(enc).toHaveProperty("CIPHER_TEXT");
      expect(blockchain.decryptDataVoter(enc)).toBe(data);
    });
  });

  describe("mineBlock", () => {
    test("should return null when transaction pool is empty", () => {
      expect(blockchain.mineBlock()).toBeNull();
    });
    test("should return null when transaction pool is invalid", () => {
      jest
        .spyOn(blockchain, "isValidTransactionPool")
        .mockReturnValueOnce(false);
      expect(blockchain.mineBlock()).toBeNull();
    });
  });

  describe("Smart Contract Integration", () => {
    test("getSmartContractVoters should return voters from smart contract", async () => {
      const voters = await blockchain.getSmartContractVoters();
      expect(blockchain.smartContract.getVoters).toHaveBeenCalled();
      expect(voters).toEqual([]);
    });

    test("getSmartContractVoters should return null and log on error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      blockchain.smartContract.getVoters.mockRejectedValueOnce(
        new Error("Voters error"),
      );
      const voters = await blockchain.getSmartContractVoters();
      expect(voters).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting smart contract voters:",
        expect.objectContaining({ message: "Voters error" }),
      );
      consoleSpy.mockRestore();
    });

    test("getSmartContractCandidates should return candidates", async () => {
      const candidates = await blockchain.getSmartContractCandidates();
      expect(blockchain.smartContract.getCandidates).toHaveBeenCalled();
      expect(candidates).toEqual([]);
    });

    test("deployVoters should call deployVotersGenerated and re-create SmartContract", async () => {
      const result = await blockchain.deployVoters();
      expect(leveldb.deployVotersGenerated).toHaveBeenCalled();
      expect(SmartContract).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });

    test("deployCandidatesBlockchain should call deployCandidates and return result", async () => {
      const result = await blockchain.deployCandidatesBlockchain();
      expect(leveldb.deployCandidates).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getCitizenRelatedIdentifier", () => {
    test("should return the identifier from storage", async () => {
      const id = await blockchain.getCitizenRelatedIdentifier("electoral-123");
      expect(leveldb.readVoterCitizenRelation).toHaveBeenCalledWith(
        "electoral-123",
      );
      expect(id).toBe("test-identifier");
    });

    test("should return null and log on storage error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      leveldb.readVoterCitizenRelation.mockRejectedValueOnce(
        new Error("Relation error"),
      );
      const id = await blockchain.getCitizenRelatedIdentifier("electoral-123");
      expect(id).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting citizen identifier:",
        expect.objectContaining({ message: "Relation error" }),
      );
      consoleSpy.mockRestore();
    });
  });
});
