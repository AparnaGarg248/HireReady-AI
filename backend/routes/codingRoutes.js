const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProblems, getProblemById, submitCode, getHistory } = require("../controllers/codingController");

router.get("/problems", protect, getProblems);
router.get("/problems/:id", protect, getProblemById);
router.post("/submit", protect, submitCode);
router.get("/history", protect, getHistory);

module.exports = router;