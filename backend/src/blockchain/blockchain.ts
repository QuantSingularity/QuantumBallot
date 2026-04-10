import assert from "node:assert";
import sha256 from "crypto-js/sha256";
import CryptoBlockchain from "../crypto/cryptoBlockchain";
import {
  clearChains,
  deployCandidates,
  deployVotersGenerated,
  readChain,
  readVoterCitizenRelation,
  updateVoter,
  writeChain,
} from "../leveldb";
import SmartContract from "../smart_contract/smart_contract";
import type { Block, BlockHeader, Transaction, Voter } from "./data_types";

let _CryptoBlockIdentifier: CryptoBlockchain | null = null;
let _CryptoBlockVote: CryptoBlockchain | null = null;

const getCryptoBlockIdentifier = () => {
  if (!_CryptoBlockIdentifier) {
    _CryptoBlockIdentifier = new CryptoBlockchain(
      process.env.SECRET_KEY_IDENTIFIER,
      process.env.SECRET_IV_IDENTIFIER,
    );
  }
  return _CryptoBlockIdentifier;
};

const getCryptoBlockVote = () => {
  if (!_CryptoBlockVote) {
    _CryptoBlockVote = new CryptoBlockchain(
      process.env.SECRET_KEY_VOTES,
      process.env.SECRET_IV_VOTES,
    );
  }
  return _CryptoBlockVote;
};

class BlockChain {
  chain: Block[];
  transactionPool: Transaction[];
  smartContract!: SmartContract;
  nodeAddress!: string;

  constructor() {
    this.chain = [this.getGenesisBlock()];
    this.transactionPool = [];

    try {
      this.smartContract = new SmartContract();
    } catch (e: any) {
      console.error("Error initializing smart contract:", e);
    }
  }

  public async setNodeAddress(nodeAddress: string) {
    this.nodeAddress = nodeAddress;
    await this.loadChain();
  }

  public async loadChain() {
    try {
      const chain = await readChain();
      if (Array.isArray(chain) && chain.length > 0) {
        this.chain = chain;
      }
    } catch (e: any) {
      console.error("Error loading chain:", e);
    }
  }

  public async clearChainsFromStorage() {
    try {
      await clearChains();
      this.chain = [this.getGenesisBlock()];
      this.transactionPool = [];
      try {
        this.smartContract = new SmartContract();
      } catch (e: any) {
        console.error("Error initializing smart contract:", e);
      }
    } catch (error: any) {
      console.error("Error clearing chains:", error);
    }

    return [];
  }

  public saveChain() {
    try {
      writeChain(this.chain);
    } catch (e: any) {
      console.error("Error saving chain:", e);
    }
  }

  public getGenesisBlock(): Block {
    return this.createGenesisBlock();
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getLengthChain(): number {
    return this.chain.length;
  }

  public replaceChain(chain: Block[]): boolean {
    if (chain.length > this.chain.length && this.isValidChain(chain)) {
      this.chain = chain;
      this.saveChain();
      return true;
    }

    return false;
  }

  public addBlock(block: Block): boolean {
    try {
      if (this.isValidBlock(block)) {
        this.chain.push(block);

        block.transactions.forEach((x) => {
          updateVoter(x.data.identifier, x.data);
        });

        this.transactionPool = [];
        this.smartContract.update();

        this.saveChain();

        return true;
      }
    } catch (e: any) {
      console.error("Error adding block:", e);
    }

    return false;
  }

  private getLastBlock(): Block | null {
    const lastIndex: number = this.chain.length - 1;
    if (lastIndex < 0) return null;
    return this.chain[lastIndex];
  }

  private isBlockLast(block: Block) {
    const lastBlock: Block | null = this.getLastBlock();
    if (lastBlock === null) return false;
    return (
      lastBlock.blockHeader.blockHash === block.blockHeader.previousBlockHash &&
      lastBlock.blockIndex + 1 === block.blockIndex
    );
  }

  public isValidBlock(block: Block): boolean {
    if (!block) return false;

    if (!this.isBlockLast(block)) {
      return false;
    }

    if (!this.isSHA256(block.blockHeader.blockHash)) {
      return false;
    }

    if (!this.isValidTimestampDifference(block.blockHeader.timestamp)) {
      return false;
    }

    if (!this.isValidTransactionPool(block.transactions)) {
      return false;
    }

    return true;
  }

  public addPendingTransaction(
    identifier: string,
    electoralId: string,
    electoralIdIV: string,
    choiceCode: string,
    choiceCodeIV: string,
    secret: string,
  ): Transaction | null {
    if (!this.smartContract || !this.smartContract.isValidElectionTime()) {
      return null;
    }

    const transaction: Transaction = this.createTransaction(
      identifier,
      electoralId,
      electoralIdIV,
      choiceCode,
      choiceCodeIV,
      secret,
    );
    if (this.isValidTransaction(transaction)) {
      this.transactionPool.push(transaction);
      return transaction;
    }

    return null;
  }

  public hashBlock(
    previousBlockHash: string,
    merkleRoot: string,
    nonce: number,
  ): string {
    const concat: string = `${previousBlockHash + merkleRoot}${nonce}`;
    return this.hashData(concat);
  }

  public createBlock(_hash: string, previousBlockHash: string, nonce: number) {
    const merkleRoot = this.createMarkle(this.transactionPool) || "-";

    const blockHeader: BlockHeader = {
      version: "1",
      blockHash: "",
      previousBlockHash: this.getLastBlock()?.blockHeader.blockHash || "-",
      merkleRoot: merkleRoot,
      timestamp: Date.now(),
      difficultyTarget: -1,
      nonce: nonce,
    };

    blockHeader.blockHash = this.hashBlock(
      previousBlockHash,
      blockHeader.merkleRoot,
      nonce,
    );

    const newBlock: Block = {
      blockIndex: this.chain.length,
      blockSize: 285,
      blockHeader: blockHeader,
      transactionCounter: this.transactionPool.length,
      transactions: [...this.transactionPool],
    };

    return newBlock;
  }

  private createGenesisBlock() {
    const blockHeader: BlockHeader = {
      version: "1",
      blockHash: "-",
      previousBlockHash: "-",
      merkleRoot: "-",
      timestamp: new Date("2022-09-03").getTime(),
      difficultyTarget: 1234,
      nonce: 1234,
    };

    const genesisBlock: Block = {
      blockIndex: 0,
      blockSize: 285,
      blockHeader: blockHeader,
      transactionCounter: 2,
      transactions: [
        this.createTransaction("00000", "00000", "-", "-", "-", "-"),
        this.createTransaction("20000", "00000", "-", "-", "-", "-"),
      ],
    };

    blockHeader.blockHash = this.hashBlock("-", blockHeader.merkleRoot, 1234);

    for (let i = 0; i < genesisBlock.transactionCounter; i++) {
      genesisBlock.transactions[i].data.voteTime = blockHeader.timestamp;
    }

    genesisBlock.blockHeader.merkleRoot =
      this.createMarkle(genesisBlock.transactions) || "-";

    return genesisBlock;
  }

  public async getSmartContractVoters() {
    try {
      const ans = await this.smartContract.getVoters();
      return ans;
    } catch (e: any) {
      console.error("Error getting smart contract voters:", e);
    }

    return null;
  }

  public async getSmartContractCandidates() {
    try {
      const ans = await this.smartContract.getCandidates();
      return ans;
    } catch (e: any) {
      console.error("Error getting smart contract candidates:", e);
    }

    return null;
  }

  public async deployVoters() {
    try {
      const ans = await deployVotersGenerated();

      try {
        this.smartContract = new SmartContract();
      } catch (e: any) {
        console.error("Error initializing smart contract:", e);
      }

      return ans;
    } catch (e: any) {
      console.error("Error deploying voters:", e);
    }

    return null;
  }

  public async deployCandidatesBlockchain() {
    try {
      const ans = await deployCandidates();
      return ans;
    } catch (e: any) {
      console.error("Error deploying candidates:", e);
    }

    return null;
  }

  public encryptDataIdentifier(data: string) {
    return getCryptoBlockIdentifier().encryptData(data);
  }

  public encryptDataVoter(data: string) {
    return getCryptoBlockVote().encryptData(data);
  }

  public decryptDataIdentifier(data: any) {
    return getCryptoBlockIdentifier().decryptData(data);
  }

  public decryptDataVoter(data: any) {
    return getCryptoBlockVote().decryptData(data);
  }

  private createTransaction(
    identifier: string,
    electoralId: string,
    electoralIdIV: string,
    choiceCode: string,
    choiceCodeIV: string,
    secret: string,
  ): Transaction {
    const vote: Voter = {
      identifier: identifier,
      electoralId: electoralId,
      electoralIV: electoralIdIV,
      choiceCode: choiceCode,
      state: true,
      secret: secret,
      voteTime: Date.now(),
      IV: choiceCodeIV,
    };

    const hashDigest: string = `${vote.identifier}${vote.choiceCode}${vote.state}`;
    const transactionHash: string = this.hashData(hashDigest);

    const transaction: Transaction = {
      data: vote,
      transactionHash: transactionHash,
    };
    return transaction;
  }

  public hashData(data: string): string {
    return sha256(data).toString();
  }

  private areObjectsEqual(obj1: Block, obj2: Block) {
    const a = JSON.stringify(obj1);
    const b = JSON.stringify(obj2);
    return a === b;
  }

  public isValidChain(chain: Block[]): boolean {
    if (!chain || chain.length === 0) return false;

    const genesisBlock: Block = this.getGenesisBlock();
    if (!this.areObjectsEqual(chain[0], genesisBlock)) {
      return false;
    }

    for (let i: number = 1; i < chain.length; ++i) {
      const prevBlock: Block = chain[i - 1];
      const curBlock: Block = chain[i];

      if (prevBlock.blockIndex + 1 !== curBlock.blockIndex) return false;

      if (
        prevBlock.blockHeader.blockHash !==
        curBlock.blockHeader.previousBlockHash
      )
        return false;

      const blockHash: string = this.hashBlock(
        prevBlock.blockHeader.blockHash,
        curBlock.blockHeader.merkleRoot,
        curBlock.blockHeader.nonce,
      );

      if (blockHash !== curBlock.blockHeader.blockHash) return false;
    }

    return true;
  }

  public proofOfIdentity() {}
  public proofOfImportance() {}

  public mineBlock(): Block | null {
    const DIFFICULTY_TARGET = 4;
    const lastHashBlock: string =
      this.getLastBlock()?.blockHeader.blockHash || "-";

    if (!this.isValidTransactionPool(this.transactionPool)) {
      return null;
    }

    const merkleRoot: string = this.createMarkle(this.transactionPool) || "-";
    const nonce: number = this.proofOfWork(
      lastHashBlock,
      merkleRoot,
      DIFFICULTY_TARGET,
    );

    const candidateBlock: Block = this.createBlock(
      this.hashBlock(lastHashBlock, merkleRoot, nonce),
      lastHashBlock,
      nonce,
    );

    return candidateBlock;
  }

  public isSHA256(str: string): boolean {
    const regExp: RegExp = /^[0-9a-fA-F]{64}$/;
    return regExp.test(str);
  }

  public isValidVote(vote: Voter): boolean {
    const length: number = vote.identifier.length;
    if (length <= 5 || length >= 50) return false;

    if (vote.choiceCode.length === 0) return false;

    if (vote.secret.length === 0) return false;

    return true;
  }

  public isValidTransactionPool(transactions: Transaction[]): boolean {
    if (!transactions || transactions.length === 0) return false;
    const mapped = transactions.map((x) => this.isValidTransaction(x));
    return mapped.every((x) => x);
  }

  public isValidTransaction(transaction: Transaction): boolean {
    if (!transaction) return false;

    if (this.isPresentedInChain(transaction)) {
      return false;
    }

    if (
      !this.isSHA256(transaction.transactionHash) ||
      !this.isValidVote(transaction.data)
    )
      return false;

    return true;
  }

  private isPresentedInChain(transaction: Transaction): boolean {
    return (
      this.getTransactions().findIndex(
        (x) =>
          x.transactionHash === transaction.transactionHash ||
          x.identifier === transaction.data.identifier,
      ) >= 0
    );
  }

  private isValidTimestampDifference(timestamp: number): boolean {
    const currentTime = Date.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const futureLimit = currentTime + twoHoursInMs;
    return timestamp <= futureLimit;
  }

  public proofOfWork(
    previousBlockHash: string,
    merkleRoot: string,
    difficultyTarget: number,
  ) {
    let nonce: number = 0;
    const prefixHash = "0".repeat(difficultyTarget);

    while (true) {
      const hash = this.hashBlock(previousBlockHash, merkleRoot, nonce);
      const sub = hash.substring(0, difficultyTarget);
      if (prefixHash === sub) break;
      nonce++;
    }
    return nonce;
  }

  toString(): string {
    return `Blockchain: ${this.chain}\nPendingTransaction: ${this.transactionPool}`;
  }

  private createMarkle(transactions: Transaction[]): string | null {
    let hashList: string[] = transactions.map((x) => x.transactionHash);

    if (hashList.length === 0) {
      return null;
    } else if (hashList.length === 1) return hashList[0];

    while (hashList.length > 1) {
      if (hashList.length % 2 !== 0) {
        const last: string = hashList[hashList.length - 1];
        hashList.push(last);
      }

      assert(hashList.length % 2 === 0);

      const newHashList: string[] = [];

      for (let i = 0; i < hashList.length; i += 2) {
        const current: string = hashList[i];
        const next: string = hashList[i + 1];

        const concat: string = `${current}${next}`;
        const newRoot: string = this.hashData(concat);
        newHashList.push(newRoot);
      }

      hashList = newHashList;
    }

    return hashList[0];
  }

  public getPendingTransactions() {
    return this.transactionPool.map((x, index) => ({
      id: index + 1,
      transactionHash: x.transactionHash,
      identifier: x.data.identifier,
      choiceCode: x.data.choiceCode,
      voteTime: x.data.voteTime,
    }));
  }

  public getTransactions() {
    const x = this.chain.flatMap((x) => x.transactions);
    return x.map((x, index) => ({
      id: index + 1,
      transactionHash: x.transactionHash,
      identifier: x.data.identifier,
      choiceCode: x.data.choiceCode,
      voteTime: x.data.voteTime,
    }));
  }

  public getBlocks() {
    return this.chain.map((x, index) => ({
      id: index + 1,
      hashBlock: x.blockHeader.blockHash,
      nonce: x.blockHeader.nonce,
      numOfTransactions: x.transactionCounter,
      dateAndTime: x.blockHeader.timestamp,
      size: x.blockSize,
    }));
  }

  public getBlockDetails(blockHash: string) {
    const x = this.chain.find((x) => x.blockHeader.blockHash === blockHash);
    return x;
  }

  public async getCitizenRelatedIdentifier(electoralId: string) {
    try {
      const identifier = await readVoterCitizenRelation(electoralId);
      return identifier;
    } catch (e: any) {
      console.error("Error getting citizen identifier:", e);
    }

    return null;
  }
}

export default BlockChain;
