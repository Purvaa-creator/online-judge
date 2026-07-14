require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require(
  "./routes/submissionRoutes"
);
const executeRoutes = require("./routes/executeRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use(
  "/api/submissions",
  submissionRoutes
);
app.use("/api/execute", executeRoutes);
pool.connect()
  .then(() => {
    console.log("PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("Database Connection Error:", err.message);
  });

app.get("/health", (req, res) => {
  res.json({
    message: "Online Judge Backend Running",
  });
});
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
