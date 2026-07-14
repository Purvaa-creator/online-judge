const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getStatsHandler } = require("../controllers/statsController");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getStatsHandler
);

module.exports = router;