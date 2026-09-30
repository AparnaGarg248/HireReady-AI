const interviewQuestionBank = require("../data/interviewQuestions");
const InterviewResult = require("../models/InterviewResult");
const { askGeminiForJSON, isGeminiConfigured } = require("../utils/geminiClient");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

// @route GET /api/interview/questions?count=5
const getQuestions = (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const shuffled = [...interviewQuestionBank].sort(() => Math.random() - 0.5);
  return res.status(200).json({ success: true, questions: shuffled.slice(0, count) });
};

// @route POST /api/interview/submit  { questions: [...], answers: [...] }
// Sends the Q&A transcript to Gemini and asks for HR-style feedback & scoring.
const submitInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { questions, answers } = req.body;

    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length !== answers.length) {
      return res.status(400).json({ success: false, message: "questions and answers arrays (equal length) are required." });
    }

    if (!isGeminiConfigured()) {
      return res.status(400).json({
        success: false,
        message: "GEMINI_API_KEY is not configured in backend/.env. Add it to enable the AI mock interview."
      });
    }

    const transcript = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(no answer given)"}`).join("\n\n");

    const prompt = `You are an experienced HR interviewer evaluating a candidate's mock interview answers.

Transcript:
${transcript}

Evaluate the candidate's communication, confidence and overall interview readiness.
Return STRICT JSON only, no markdown, in this exact shape:
{
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "strengths": ["...", "..."],
  "improvementAreas": ["...", "..."],
  "feedback": "a short paragraph of overall feedback"
}`;

    const evaluation = await askGeminiForJSON(prompt);

    const interviewResult = await InterviewResult.create({
      userId,
      questions,
      answers,
      feedback: evaluation.feedback || "",
      strengths: evaluation.strengths || [],
      improvementAreas: evaluation.improvementAreas || [],
      communicationScore: evaluation.communicationScore || 0,
      confidenceScore: evaluation.confidenceScore || 0,
      overallScore: evaluation.overallScore || 0
    });

    await recalculateReadiness(userId);

    return res.status(201).json({ success: true, message: "Interview evaluated successfully!", result: interviewResult });
  } catch (error) {
    console.error("Interview Submission Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to evaluate interview." });
  }
};

// @route GET /api/interview/history
const getHistory = async (req, res) => {
  try {
    const history = await InterviewResult.find({ userId: req.user.id }).sort({ interviewDate: -1 });
    return res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load interview history." });
  }
};

module.exports = { getQuestions, submitInterview, getHistory };
