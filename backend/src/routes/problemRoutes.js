const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);
const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  createProblemHandler,
  getAllProblemsHandler,
  getProblemByIdHandler,
  updateProblemHandler,
  deleteProblemHandler,
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
  adminMiddleware,
  createProblemHandler
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProblemHandler
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProblemHandler
);
router.post(
  "/:id/testcases",
  authMiddleware,
  adminMiddleware,
  createTestCaseHandler
);

module.exports = router;
