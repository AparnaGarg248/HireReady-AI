const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getQuestions, submitInterview, getHistory } = require("../controllers/interviewController");

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitInterview);
router.get("/history", protect, getHistory);

module.exports = router;