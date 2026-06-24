const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createProblemHandler,
} = require("../controllers/problemController");

router.post(
  "/",
  authMiddleware,
  createProblemHandler
);

module.exports = router;
