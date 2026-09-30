const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { askGeminiForJSON, isGeminiConfigured } = require("../utils/geminiClient");
const { extractResumeText } = require("../utils/extractResumeText");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a resume file (.pdf, .doc, .docx)." });
    }

    const userId = req.user.id;
    const file = req.file;

    let resume = await Resume.findOne({ userId });

    if (resume) {
      const oldPath = path.join(__dirname, "../", resume.filePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      resume.fileName = file.originalname;
      resume.storedName = file.filename;
      resume.filePath = `uploads/resumes/${file.filename}`;
      resume.fileType = file.mimetype;
      resume.fileSize = file.size;
      resume.uploadDate = new Date();
      // reset previous AI analysis since the file changed
      resume.atsScore = 0;
      resume.strengths = [];
      resume.suggestions = [];
      resume.missingKeywords = [];
      resume.analysisSummary = "";
      resume.analyzedAt = undefined;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        fileName: file.originalname,
        storedName: file.filename,
        filePath: `uploads/resumes/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size
      });
    }

    return res.status(200).json({ success: true, message: "Resume uploaded successfully!", resume });
  } catch (error) {
    console.error("Resume Upload Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Error uploading resume." });
  }
};

const analyzeResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeText, targetRole } = req.body;

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Please upload a resume first." });
    }

    if (!isGeminiConfigured()) {
      return res.status(400).json({
        success: false,
        message: "GEMINI_API_KEY is not configured in backend/.env. Add it to enable AI resume analysis."
      });
    }

    let finalResumeText = (resumeText || "").trim();
    let extractionNote = "";

    if (!finalResumeText) {
      const fullPath = path.join(__dirname, "../", resume.filePath);
      finalResumeText = await extractResumeText(fullPath, resume.fileType, resume.fileName);

      if (!finalResumeText) {
        extractionNote =
          " (Automatic text extraction from the uploaded file failed or returned nothing" +
          " — this can happen with scanned/image-only PDFs or legacy .doc files." +
          " Falling back to the file name only.)";
      }
    }

    const prompt = `You are an ATS (Applicant Tracking System) and career expert.
Analyze the following resume content for a student applying for a role as: ${targetRole || "Software Engineer"}.

Resume content:
"""
${finalResumeText || "(No resume text available, evaluate based on the file name: " + resume.fileName + extractionNote + ")"}
"""

Return STRICT JSON only, no markdown, in this exact shape:
{
  "atsScore": <number 0-100>,
  "strengths": ["...", "..."],
  "suggestions": ["...", "..."],
  "missingKeywords": ["...", "..."],
  "summary": "one short paragraph summary"
}`;

    const analysis = await askGeminiForJSON(prompt);

    resume.atsScore = analysis.atsScore || 0;
    resume.strengths = analysis.strengths || [];
    resume.suggestions = analysis.suggestions || [];
    resume.missingKeywords = analysis.missingKeywords || [];
    resume.analysisSummary = analysis.summary || "";
    resume.analyzedAt = new Date();
    await resume.save();

    await recalculateReadiness(userId);

    return res.status(200).json({ success: true, message: "Resume analyzed successfully!", resume });
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Error analyzing resume." });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(200).json({ success: true, hasResume: false });
    }
    return res.status(200).json({ success: true, hasResume: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch resume details." });
  }
};

const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "No resume found." });
    }
    const fullPath = path.join(__dirname, "../", resume.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: "Resume file missing on disk." });
    }
    return res.download(fullPath, resume.fileName);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error downloading resume." });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ userId: req.user.id });
    if (resume) {
      const fullPath = path.join(__dirname, "../", resume.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    return res.status(200).json({ success: true, message: "Resume removed successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete resume." });
  }
};

module.exports = { uploadResume, analyzeResume, getResume, downloadResume, deleteResume };