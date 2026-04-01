import { connectToDB } from "./leveldb";
import BlockChain from "./blockchain/blockchain";

const serverClient = require("./network/server-client");

const PORT = process.argv[2] || process.env.PORT || "3000";

const startNetwork = async () => {
  try {
    await connectToDB();
    const blockchain = new BlockChain();
    blockchain.setNodeAddress(PORT.toString());
    serverClient(blockchain, PORT);
  } catch (error: any) {
    console.error("Failed to start network node:", error);
    process.exit(1);
  }
};

startNetwork();
