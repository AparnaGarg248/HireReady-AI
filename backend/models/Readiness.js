const mongoose = require("mongoose");

const readinessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  resumeScore: { type: Number, default: 0 },
  codingScore: { type: Number, default: 0 },
  aptitudeScore: { type: Number, default: 0 },
  interviewScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  weakAreas: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Readiness || mongoose.model("Readiness", readinessSchema);
