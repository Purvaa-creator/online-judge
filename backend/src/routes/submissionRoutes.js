const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createSubmissionHandler, getAllSubmissionsHandler, getMySubmissionsHandler, getSubmissionByIdHandler,
} = require("../controllers/submissionController");
router.get(
  "/",
  getAllSubmissionsHandler
);
router.get(
  "/mine",
  authMiddleware,
  getMySubmissionsHandler
);
router.get(
  "/:id",
  getSubmissionByIdHandler
);
router.post(
  "/",
  authMiddleware,
  createSubmissionHandler
);

module.exports = router;
