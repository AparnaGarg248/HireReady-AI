const Resume = require("../models/Resume");
const AptitudeResult = require("../models/AptitudeResult");
const CodingResult = require("../models/CodingResult");
const InterviewResult = require("../models/InterviewResult");
const Readiness = require("../models/Readiness");

// Weights as defined on the "Overall Placement Readiness Index" screen:
// Resume 20% | Coding 30% | Aptitude 25% | Interview 25%
const WEIGHTS = { resume: 0.2, coding: 0.3, aptitude: 0.25, interview: 0.25 };

async function recalculateReadiness(userId) {
  const [resume, aptitudeResults, codingResults, interviewResults] = await Promise.all([
    Resume.findOne({ userId }),
    AptitudeResult.find({ userId }),
    CodingResult.find({ userId }),
    InterviewResult.find({ userId }).sort({ interviewDate: -1 })
  ]);

  const resumeScore = resume?.atsScore || 0;

  const aptitudeScore =
    aptitudeResults.length > 0
      ? Math.round(aptitudeResults.reduce((sum, r) => sum + r.percentage, 0) / aptitudeResults.length)
      : 0;

  const codingScore =
    codingResults.length > 0
      ? Math.round(codingResults.reduce((sum, r) => sum + r.score, 0) / codingResults.length)
      : 0;

  const interviewScore = interviewResults.length > 0 ? interviewResults[0].overallScore : 0;

  const overallScore = Math.round(
    resumeScore * WEIGHTS.resume +
      codingScore * WEIGHTS.coding +
      aptitudeScore * WEIGHTS.aptitude +
      interviewScore * WEIGHTS.interview
  );

  // Work out weakest two areas so the roadmap can target them
  const areaScores = [
    { name: "Resume", score: resumeScore },
    { name: "Coding", score: codingScore },
    { name: "Aptitude", score: aptitudeScore },
    { name: "Interview", score: interviewScore }
  ].sort((a, b) => a.score - b.score);

  const weakAreas = areaScores.slice(0, 2).map((a) => a.name);

  const readiness = await Readiness.findOneAndUpdate(
    { userId },
    { resumeScore, codingScore, aptitudeScore, interviewScore, overallScore, weakAreas, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  return readiness;
}

module.exports = { recalculateReadiness, WEIGHTS };
