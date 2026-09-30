import React, { useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";

const CATEGORIES = ["Comprehensive Assessment", "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"];

export default function AptitudePage() {
  const [category, setCategory] = useState("Comprehensive Assessment");
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(null);

  const startTest = async () => {
    setError("");
    setResult(null);
    setAnswers({});
    setLoading(true);
    try {
      const res = await api.get("/aptitude/questions", { params: { category } });
      setQuestions(res.data.questions);
      setStartTime(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || "Could not load questions.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qId, optionIndex) => setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
      const res = await api.post("/aptitude/submit", { category, answers, timeTakenSeconds });
      setResult(res.data.result);
      setQuestions(null);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Aptitude Assessment</h1>
      <p className="text-sm text-gray-500 mb-6">Choose a category and take an auto-evaluated aptitude test.</p>

      <Alert type="error" message={error} />

      {!questions && !result && (
        <div className="card max-w-md">
          <label className="text-sm font-medium text-gray-700">Select Category</label>
          <select className="input-field mt-1 mb-4" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="btn-primary w-full" onClick={startTest} disabled={loading}>
            {loading ? "Loading questions..." : "Start Test"}
          </button>
        </div>
      )}

      {loading && <Loader label="Preparing your questions..." />}

      {questions && (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="card">
              <p className="font-medium text-gray-900 mb-3">
                Q{idx + 1}. {q.question}
                <span className="text-xs text-gray-400 ml-2">({q.topic})</span>
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`block border rounded-lg px-3 py-2 text-sm cursor-pointer ${
                      answers[q.id] === i ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="mr-2"
                      checked={answers[q.id] === i}
                      onChange={() => selectAnswer(q.id, i)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      )}

      {result && (
        <div className="card max-w-lg">
          <h2 className="font-semibold text-gray-900 mb-3">Result: {result.category}</h2>
          <p className="text-3xl font-bold text-primary mb-2">{result.percentage}%</p>
          <p className="text-sm text-gray-600 mb-4">
            {result.correctAnswers} correct / {result.incorrectAnswers} incorrect / {result.unattemptedQuestions} unattempted out of{" "}
            {result.totalQuestions} questions
          </p>
          <button className="btn-outline" onClick={() => setResult(null)}>
            Take Another Test
          </button>
        </div>
      )}
    </AppLayout>
  );
}
