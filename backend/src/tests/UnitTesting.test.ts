import { randomUUID } from "node:crypto";
import fs from "node:fs";

// Mock leveldb before importing blockchain
jest.mock("../leveldb", () => ({
  readChain: jest.fn().mockResolvedValue([]),
  writeChain: jest.fn(),
  clearChains: jest.fn().mockResolvedValue([]),
  updateVoter: jest.fn(),
  deployVotersGenerated: jest.fn().mockResolvedValue([]),
  deployCandidates: jest.fn().mockResolvedValue([]),
  readVoterCitizenRelation: jest.fn().mockResolvedValue("test-identifier"),
}));

// Mock smart contract
jest.mock("../smart_contract/smart_contract", () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      update: jest.fn(),
      isValidElectionTime: jest.fn().mockReturnValue(true),
      getVoters: jest.fn().mockResolvedValue([]),
      getCandidates: jest.fn().mockResolvedValue([]),
    })),
  };
});

import BlockChain from "../blockchain/blockchain";
import CryptoBlockchain from "../crypto/cryptoBlockchain";

describe("BlockChain", () => {
  let blockchain: any;

  beforeEach(() => {
    blockchain = new BlockChain();
  });

  test("Creates a new instance of BlockChain", () => {
    expect(blockchain).toBeInstanceOf(BlockChain);
  });

  test("Check existence of the one block, the GenesisBlock and returns the chain of blocks", () => {
    const chain = blockchain.getChain();
    expect(chain).toBeInstanceOf(Array);
    expect(chain.length).toBe(1);
  });

  test("Encrypt and Decrypt Data Identifier", () => {
    const data = "We are performing a unit testing.";
    const encryptedData = blockchain.encryptDataIdentifier(data);
    const decryptedData = blockchain.decryptDataIdentifier(encryptedData);

    expect(decryptedData).toBe(data);
  });

  test("Encrypt and Decrypt Data Voter", () => {
    const data = "We are performing a unit testing.";
    const encryptedData = blockchain.encryptDataVoter(data);
    const decryptedData = blockchain.decryptDataVoter(encryptedData);

    expect(decryptedData).toBe(data);
  });

  test("Hash Data using SHA256", () => {
    const data = "We are performing a unit testing.";
    const hash = blockchain.hashData(data);

    expect(hash).toMatch(/^[0-9a-fA-F]{64}$/);
  });
});

describe("Network", () => {
  test("Generates different node addresses", () => {
    const ids = [1, 2].map((_) =>
      randomUUID().split("-").join("").substr(0, 4),
    );
    expect(ids[0]).not.toBe(ids[1]);
  });
});

describe("Secret generation Tests", () => {
  let cyptoChain: any;

  beforeEach(() => {
    cyptoChain = new CryptoBlockchain("", "");
  });

  it("Generate a secret key and IV", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    cyptoChain.generateSecret();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "secret.key",
      expect.any(String),
    );
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    consoleSpy.mockRestore();
    (fs.writeFileSync as jest.Mock).mockRestore?.();
  });
});
