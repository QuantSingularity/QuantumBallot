// FIX 1: corrected import depth — api/ is 3 levels from code/, not 4
// FIX 3: router created INSIDE factory, not at module scope (prevents double-registration)
import type BlockChain from "../../../blockchain/src/core/blockchain";

const express = require("express");
const cors = require("cors");
const corsOptions = require("../config/coreOptions");
const cookieParser = require("cookie-parser");
const credentials = require("../middleware/credentials");

module.exports = (blockchain: BlockChain, allNodes: string[]) => {
  // Router created fresh per call — prevents route double-registration if
  // this module is required more than once (e.g. main server + P2P node)
  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: false }));
  router.use(cors(corsOptions));
  router.use(cookieParser());
  router.use(credentials);

  router.use(
    "/blockchain",
    require("./routes/blockchain.route")(blockchain, allNodes),
  );
  router.use("/committee", require("./routes/committee.route"));
  return router;
};
