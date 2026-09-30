require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB, getDBStatus } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const codingRoutes = require("./routes/codingRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const readinessRoutes = require("./routes/readinessRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 👉 Connect to MongoDB Atlas using MONGODB_URI from backend/.env
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes statically (only reachable with the download route in practice)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "HireReady AI Backend",
    timestamp: new Date().toISOString(),
    database: getDBStatus()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`HireReady AI backend running on http://localhost:${PORT}`);
});
