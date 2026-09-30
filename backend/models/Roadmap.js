const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  weakAreas: [{ type: String }],
  weeklyPlan: [
    {
      week: { type: Number },
      focusArea: { type: String },
      tasks: [{ type: String }]
    }
  ],
  summary: { type: String, default: "" },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema);