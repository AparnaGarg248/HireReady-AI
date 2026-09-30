const questionBank = require("../data/aptitudeQuestions");
const AptitudeResult = require("../models/AptitudeResult");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

const getQuestions = (req, res) => {
  try {
    const { category, count } = req.query;
    let questions = [...questionBank];

    if (category && category !== "Comprehensive Assessment") {
      questions = questions.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }

    const limit = parseInt(count) || questions.length;
    const selected = questions.slice(0, limit);

    const sanitized = selected.map((q, idx) => ({
      id: q.id,
      index: idx + 1,
      category: q.category,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({
      success: true,
      category: category || "Comprehensive Assessment",
      totalQuestions: sanitized.length,
      questions: sanitized
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load aptitude questions." });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, answers, timeTakenSeconds } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Answers object is required." });
    }

    let testQuestions = [...questionBank];
    if (category && category !== "Comprehensive Assessment") {
      testQuestions = testQuestions.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }

    const totalQuestions = testQuestions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let attemptedQuestions = 0;
    const review = [];

    testQuestions.forEach((q) => {
      const selected = answers[q.id] !== undefined ? parseInt(answers[q.id]) : null;
      const isAttempted = selected !== null && !isNaN(selected) && selected >= 0;

      if (isAttempted) {
        attemptedQuestions++;
        const isCorrect = selected === q.correctAnswer;
        isCorrect ? correctAnswers++ : incorrectAnswers++;
        review.push({ id: q.id, question: q.question, selected, correct: q.correctAnswer, isCorrect, explanation: q.explanation });
      } else {
        review.push({ id: q.id, question: q.question, selected: null, correct: q.correctAnswer, isCorrect: false, explanation: q.explanation });
      }
    });

    const unattemptedQuestions = totalQuestions - attemptedQuestions;
    const percentage = totalQuestions > 0 ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(1)) : 0;
    const targetCategory = category || "Comprehensive Assessment";

    const result = await AptitudeResult.create({
      userId,
      category: targetCategory,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      unattemptedQuestions,
      score: correctAnswers,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0
    });

    await recalculateReadiness(userId);

    return res.status(201).json({
      success: true,
      message: "Assessment submitted and scored successfully!",
      result: { ...result.toObject(), review }
    });
  } catch (error) {
    console.error("Submit Assessment Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process assessment submission." });
  }
};

const getResultsHistory = async (req, res) => {
  try {
    const history = await AptitudeResult.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load assessment history." });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const results = await AptitudeResult.find({ userId: req.user.id }).sort({ createdAt: 1 });
    const totalAttempts = results.length;

    if (totalAttempts === 0) {
      return res.status(200).json({
        success: true,
        hasAttempts: false,
        totalAttempts: 0,
        chartData: { labels: [], percentages: [], scores: [] }
      });
    }

    const latest = results[results.length - 1];
    const percentages = results.map((r) => r.percentage);
    const highestPercentage = Math.max(...percentages);
    const averagePercentage = parseFloat((percentages.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(1));

    return res.status(200).json({
      success: true,
      hasAttempts: true,
      totalAttempts,
      latestPercentage: latest.percentage,
      latestCategory: latest.category,
      highestPercentage,
      averagePercentage,
      chartData: {
        labels: results.map((r, i) => `Attempt ${i + 1}`),
        percentages: results.map((r) => r.percentage),
        scores: results.map((r) => r.score)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to retrieve analytics." });
  }
};

module.exports = { getQuestions, submitAssessment, getResultsHistory, getAnalytics };
