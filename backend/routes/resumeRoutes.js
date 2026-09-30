const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume, analyzeResume, getResume, downloadResume, deleteResume } = require("../controllers/resumeController");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/analyze", protect, analyzeResume);
router.get("/", protect, getResume);
router.get("/download", protect, downloadResume);
router.delete("/", protect, deleteResume);

module.exports = router;
