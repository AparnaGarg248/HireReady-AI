import React, { useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";

export default function InterviewPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const startInterview = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await api.get("/interview/questions", { params: { count: 5 } });
      setQuestions(res.data.questions);
      setAnswers(new Array(res.data.questions.length).fill(""));
    } catch (err) {
      setError(err.response?.data?.message || "Could not start interview.");
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (idx, value) => {
    const copy = [...answers];
    copy[idx] = value;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/interview/submit", { questions, answers });
      setResult(res.data.result);
      setQuestions(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not evaluate interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Mock HR Interview</h1>
      <p className="text-sm text-gray-500 mb-6">Answer common HR questions and get instant AI feedback powered by Gemini.</p>

      <Alert type="error" message={error} />

      {!questions && !result && (
        <div className="card max-w-md">
          <p className="text-sm text-gray-600 mb-4">You will be asked 5 random HR questions. Answer honestly for the most useful feedback.</p>
          <button className="btn-primary" onClick={startInterview} disabled={loading}>
            {loading ? "Preparing questions..." : "Start Mock Interview"}
          </button>
        </div>
      )}

      {loading && <Loader />}

      {questions && (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="card">
              <p className="font-medium text-gray-900 mb-2">Q{idx + 1}. {q}</p>
              <textarea
                className="input-field h-24"
                placeholder="Type your answer..."
                value={answers[idx]}
                onChange={(e) => updateAnswer(idx, e.target.value)}
              />
            </div>
          ))}
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Evaluating with Gemini..." : "Submit for AI Feedback"}
          </button>
        </div>
      )}

      {result && (
        <div className="card max-w-2xl">
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-xs text-gray-500">Overall Score</p>
              <p className="text-2xl font-bold text-primary">{result.overallScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Communication</p>
              <p className="text-2xl font-bold text-gray-800">{result.communicationScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="text-2xl font-bold text-gray-800">{result.confidenceScore}/100</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{result.feedback}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-green-700 mb-1">Strengths</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-1">Areas to Improve</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {result.improvementAreas?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
          <button className="btn-outline mt-4" onClick={() => setResult(null)}>
            Take Another Interview
          </button>
        </div>
      )}
    </AppLayout>
  );
}
