import type BlockChain from "../blockchain/blockchain";

const express = require("express");
const cors = require("cors");
const corsOptions = require("../config/coreOptions");
const cookieParser = require("cookie-parser");
const credentials = require("../middleware/credentials");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cors(corsOptions));
router.use(cookieParser());
router.use(credentials);

module.exports = (blockchain: BlockChain, allNodes: string[]) => {
  const redirectRoute = (text: string) => require(text)(blockchain, allNodes);

  router.use("/blockchain", redirectRoute("./routes/blockchain.route"));
  router.use("/committee", require("./routes/committee.route"));

  return router;
};
