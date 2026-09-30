const codingProblems = require("../data/codingProblems");
const CodingResult = require("../models/CodingResult");
const { runOnPiston, LANGUAGE_VERSIONS, isPistonConfigured } = require("../utils/pistonClient");
const { recalculateReadiness } = require("../utils/recalculateReadiness");

// @route GET /api/coding/problems
const getProblems = (req, res) => {
  const list = codingProblems.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    description: p.description,
    starterCode: p.starterCode
  }));
  return res.status(200).json({ success: true, problems: list });
};

// @route GET /api/coding/problems/:id
const getProblemById = (req, res) => {
  const problem = codingProblems.find((p) => p.id === parseInt(req.params.id));
  if (!problem) return res.status(404).json({ success: false, message: "Problem not found." });
  return res.status(200).json({
    success: true,
    problem: {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      starterCode: problem.starterCode,
      sampleTestCase: problem.testCases[0]
    }
  });
};

// @route POST /api/coding/submit  { problemId, language, code }
// Runs the submitted code against every test case via Piston and stores the score.
const submitCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ success: false, message: "problemId, language and code are required." });
    }

    const problem = codingProblems.find((p) => p.id === parseInt(problemId));
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found." });

    if (!LANGUAGE_VERSIONS[language]) {
      return res.status(400).json({ success: false, message: "Unsupported language. Use javascript, python, java or cpp." });
    }

    if (!isPistonConfigured()) {
      return res.status(400).json({
        success: false,
        message: "Code execution service is not available."
      });
    }

    let passedTestCases = 0;
    const testResults = [];

    for (const testCase of problem.testCases) {
      const result = await runOnPiston({ sourceCode: code, language, stdin: testCase.input });
      const actualOutput = (result.stdout || "").trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = actualOutput === expectedOutput;
      if (passed) passedTestCases++;

      testResults.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        status: result.status,
        stderr: result.stderr,
        compileOutput: result.compileOutput
      });
    }

    const totalTestCases = problem.testCases.length;
    const score = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;

    const submission = await CodingResult.create({
      userId,
      problemId: problem.id,
      problemTitle: problem.title,
      language,
      code,
      totalTestCases,
      passedTestCases,
      score
    });

    await recalculateReadiness(userId);

    return res.status(201).json({
      success: true,
      message: "Code executed and evaluated successfully!",
      submission,
      testResults
    });
  } catch (error) {
    console.error("Coding Submission Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to evaluate submission." });
  }
};

// @route GET /api/coding/history
const getHistory = async (req, res) => {
  try {
    const history = await CodingResult.find({ userId: req.user.id }).sort({ submissionDate: -1 });
    return res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load coding history." });
  }
};

module.exports = { getProblems, getProblemById, submitCode, getHistory };
