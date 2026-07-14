const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { executeHandler } = require("../controllers/executeController");

router.post("/", authMiddleware, executeHandler);

module.exports = router;