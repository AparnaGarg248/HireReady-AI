const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllStudents, getStudentDetail, getPlatformStats } = require("../controllers/adminController");

router.get("/users", protect, adminOnly, getAllStudents);
router.get("/students/:id", protect, adminOnly, getStudentDetail);
router.get("/stats", protect, adminOnly, getPlatformStats);

module.exports = router;
