const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createProblemHandler,getAllProblemsHandler, getProblemByIdHandler,
} = require("../controllers/problemController");
const {
  createTestCaseHandler,
} = require("../controllers/testCaseController");
router.get(
  "/",
  getAllProblemsHandler
);
router.get(
  "/:id",
  getProblemByIdHandler
);
router.post(
  "/",
  authMiddleware,
  createProblemHandler
);
router.post(
  "/:id/testcases",
  authMiddleware,
  createTestCaseHandler
);

module.exports = router;
