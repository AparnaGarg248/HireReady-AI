const User = require("../models/User");
const Readiness = require("../models/Readiness");
const AptitudeResult = require("../models/AptitudeResult");
const CodingResult = require("../models/CodingResult");
const InterviewResult = require("../models/InterviewResult");
const Resume = require("../models/Resume");

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
    const readinessList = await Readiness.find({});
    const readinessMap = new Map(readinessList.map((r) => [r.userId.toString(), r]));

    const result = students.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      college: s.college,
      branch: s.branch,
      academicYear: s.academicYear,
      overallScore: readinessMap.get(s._id.toString())?.overallScore || 0
    }));

    return res.status(200).json({ success: true, count: result.length, students: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch students." });
  }
};

const getStudentDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const [user, readiness, resume, aptitude, coding, interview] = await Promise.all([
      User.findById(userId).select("-password"),
      Readiness.findOne({ userId }),
      Resume.findOne({ userId }),
      AptitudeResult.find({ userId }).sort({ createdAt: -1 }),
      CodingResult.find({ userId }).sort({ submissionDate: -1 }),
      InterviewResult.find({ userId }).sort({ interviewDate: -1 })
    ]);

    if (!user) return res.status(404).json({ success: false, message: "Student not found." });

    return res.status(200).json({ success: true, data: { user, readiness, resume, aptitude, coding, interview } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch student details." });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const [totalStudents, totalAptitudeAttempts, totalCodingAttempts, totalInterviews, readinessList] = await Promise.all([
      User.countDocuments({ role: "student" }),
      AptitudeResult.countDocuments({}),
      CodingResult.countDocuments({}),
      InterviewResult.countDocuments({}),
      Readiness.find({})
    ]);

    const averageReadiness =
      readinessList.length > 0
        ? Math.round(readinessList.reduce((sum, r) => sum + r.overallScore, 0) / readinessList.length)
        : 0;

    return res.status(200).json({
      success: true,
      stats: { totalStudents, totalAptitudeAttempts, totalCodingAttempts, totalInterviews, averageReadiness }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch platform statistics." });
  }
};

module.exports = { getAllStudents, getStudentDetail, getPlatformStats };