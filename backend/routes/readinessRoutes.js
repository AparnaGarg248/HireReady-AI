const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getReadiness, refreshReadiness } = require("../controllers/readinessController");

router.get("/", protect, getReadiness);
router.post("/recalculate", protect, refreshReadiness);

module.exports = router;
