import type BlockChain from "../../../../blockchain/src/core/blockchain";

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
  router.use(
    "/blockchain",
    require("./routes/blockchain.route")(blockchain, allNodes),
  );
  router.use("/committee", require("./routes/committee.route"));
  return router;
};
