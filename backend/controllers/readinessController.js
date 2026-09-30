const Readiness = require("../models/Readiness");
const { recalculateReadiness, WEIGHTS } = require("../utils/recalculateReadiness");

// @route GET /api/readiness
const getReadiness = async (req, res) => {
  try {
    let readiness = await Readiness.findOne({ userId: req.user.id });
    if (!readiness) {
      readiness = await recalculateReadiness(req.user.id);
    }
    return res.status(200).json({ success: true, readiness, weights: WEIGHTS });
  } catch (error) {
    console.error("Readiness Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Could not compute readiness score." });
  }
};

// @route POST /api/readiness/recalculate
const refreshReadiness = async (req, res) => {
  try {
    const readiness = await recalculateReadiness(req.user.id);
    return res.status(200).json({ success: true, readiness });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not recalculate readiness score." });
  }
};

module.exports = { getReadiness, refreshReadiness };
