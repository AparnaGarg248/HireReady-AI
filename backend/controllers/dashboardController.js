const User = require("../models/User");
const Resume = require("../models/Resume");
const AptitudeResult = require("../models/AptitudeResult");
const CodingResult = require("../models/CodingResult");
const InterviewResult = require("../models/InterviewResult");
const Readiness = require("../models/Readiness");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, resume, aptitudeResults, codingResults, interviewResults, readiness] = await Promise.all([
      User.findById(userId).select("-password"),
      Resume.findOne({ userId }),
      AptitudeResult.find({ userId }).sort({ createdAt: -1 }),
      CodingResult.find({ userId }).sort({ submissionDate: -1 }),
      InterviewResult.find({ userId }).sort({ interviewDate: -1 }),
      Readiness.findOne({ userId })
    ]);

    const finalReadiness = readiness || (await recalculateReadiness(userId));

    return res.status(200).json({
      success: true,
      data: {
        student: user,
        readiness: finalReadiness,
        resume: resume
          ? { fileName: resume.fileName, atsScore: resume.atsScore, uploadDate: resume.uploadDate, analyzed: !!resume.analyzedAt }
          : null,
        aptitude: {
          totalAttempts: aptitudeResults.length,
          latest: aptitudeResults[0] || null
        },
        coding: {
          totalAttempts: codingResults.length,
          latest: codingResults[0] || null
        },
        interview: {
          totalAttempts: interviewResults.length,
          latest: interviewResults[0] || null
        }
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to assemble dashboard data." });
  }
};

module.exports = { getDashboardSummary };