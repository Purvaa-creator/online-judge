const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,login,getCurrentUserHandler,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUserHandler);
module.exports = router;
