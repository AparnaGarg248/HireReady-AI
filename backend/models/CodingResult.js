const mongoose = require("mongoose");

const codingResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: Number, required: true },
  problemTitle: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  totalTestCases: { type: Number, default: 0 },
  passedTestCases: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CodingResult || mongoose.model("CodingResult", codingResultSchema);
