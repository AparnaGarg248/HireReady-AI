import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";

const LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function CodingPage() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/coding/problems")
      .then((res) => setProblems(res.data.problems))
      .finally(() => setLoading(false));
  }, []);

  const openProblem = (problem) => {
    setSelected(problem);
    setLanguage("javascript");
    setCode("");
    setSubmission(null);
    setTestResults([]);
    setError("");
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(selected.starterCode[lang] || "");
  };

  const handleSubmit = async () => {
    setRunning(true);
    setError("");
    try {
      const res = await api.post("/coding/submit", { problemId: selected.id, language, code });
      setSubmission(res.data.submission);
      setTestResults(res.data.testResults);
    } catch (err) {
      setError(err.response?.data?.message || "Execution failed.");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <Loader />
    </AppLayout>
  );

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Coding Assessment</h1>
      <p className="text-sm text-gray-500 mb-6">Solve DSA problems; your code runs against real test cases via Judge0.</p>

      <Alert type="error" message={error} />

      {!selected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((p) => (
            <button key={p.id} onClick={() => openProblem(p)} className="card text-left hover:shadow-md transition">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.difficulty}</span>
              </div>
              <p className="text-sm text-gray-500">{p.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button className="text-sm text-accent mb-4" onClick={() => setSelected(null)}>
            ← Back to problems
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-2">{selected.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{selected.description}</p>
              <p className="text-xs text-gray-400">Sample input/output shown once you run your code.</p>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Language</label>
                <select className="input-field w-40" value={language} onChange={(e) => changeLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full h-64 font-mono text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
              <button className="btn-primary mt-3" onClick={handleSubmit} disabled={running}>
                {running ? "Running on Judge0..." : "Run & Submit"}
              </button>
            </div>
          </div>

          {submission && (
            <div className="card mt-6">
              <h2 className="font-semibold text-gray-900 mb-2">
                Score: {submission.score}% ({submission.passedTestCases}/{submission.totalTestCases} test cases passed)
              </h2>
              <div className="space-y-2 mt-3">
                {testResults.map((t, i) => (
                  <div key={i} className={`text-xs border rounded-lg p-2 ${t.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    <p><strong>Input:</strong> {t.input}</p>
                    <p><strong>Expected:</strong> {t.expectedOutput}</p>
                    <p><strong>Got:</strong> {t.actualOutput || "(no output)"}</p>
                    {t.stderr && <p className="text-red-600"><strong>Error:</strong> {t.stderr}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
