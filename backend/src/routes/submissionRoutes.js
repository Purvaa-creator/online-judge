const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createSubmissionHandler,
} = require("../controllers/submissionController");

router.post(
  "/",
  authMiddleware,
  createSubmissionHandler
);

module.exports = router;
