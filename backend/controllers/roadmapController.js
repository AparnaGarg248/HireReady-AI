const Roadmap = require("../models/Roadmap");
const Readiness = require("../models/Readiness");
const { askGeminiForJSON, isGeminiConfigured } = require("../utils/geminiClient");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!isGeminiConfigured()) {
      return res.status(400).json({
        success: false,
        message: "GEMINI_API_KEY is not configured in backend/.env. Add it to enable the AI roadmap."
      });
    }

    const readiness = (await Readiness.findOne({ userId })) || (await recalculateReadiness(userId));

    const prompt = `A student's placement readiness scores are:
Resume: ${readiness.resumeScore}/100
Coding: ${readiness.codingScore}/100
Aptitude: ${readiness.aptitudeScore}/100
Interview: ${readiness.interviewScore}/100
Overall: ${readiness.overallScore}/100
Their weakest areas are: ${readiness.weakAreas.join(", ")}.

Create a personalized 4-week placement preparation roadmap focused on improving
their weak areas first. Return STRICT JSON only, no markdown, in this exact shape:
{
  "summary": "one short paragraph summary of the plan",
  "weeklyPlan": [
    { "week": 1, "focusArea": "...", "tasks": ["...", "...", "..."] },
    { "week": 2, "focusArea": "...", "tasks": ["...", "...", "..."] },
    { "week": 3, "focusArea": "...", "tasks": ["...", "...", "..."] },
    { "week": 4, "focusArea": "...", "tasks": ["...", "...", "..."] }
  ]
}`;

    const plan = await askGeminiForJSON(prompt);

    const roadmap = await Roadmap.findOneAndUpdate(
      { userId },
      {
        weakAreas: readiness.weakAreas,
        weeklyPlan: plan.weeklyPlan || [],
        summary: plan.summary || "",
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, message: "Roadmap generated successfully!", roadmap });
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate roadmap." });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(200).json({ success: true, hasRoadmap: false });
    }
    return res.status(200).json({ success: true, hasRoadmap: true, roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch roadmap." });
  }
};

module.exports = { generateRoadmap, getRoadmap };