const mongoose = require("mongoose");

const interviewResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [{ type: String }],
  answers: [{ type: String }],
  feedback: { type: String, default: "" },
  strengths: [{ type: String }],
  improvementAreas: [{ type: String }],
  communicationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  interviewDate: { type: Date, default: Date.now }
});

module.exports = mongoose.models.InterviewResult || mongoose.model("InterviewResult", interviewResultSchema);
