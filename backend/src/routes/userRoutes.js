const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getAllUsersHandler } = require("../controllers/userController");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsersHandler
);

module.exports = router;