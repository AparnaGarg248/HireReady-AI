const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fileName: { type: String, required: true },
  storedName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, default: "application/pdf" },
  fileSize: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },

  atsScore: { type: Number, default: 0 },
  strengths: [{ type: String }],
  suggestions: [{ type: String }],
  missingKeywords: [{ type: String }],
  analysisSummary: { type: String, default: "" },
  analyzedAt: { type: Date }
});

module.exports = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
