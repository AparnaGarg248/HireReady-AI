import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadResume = () => {
    api
      .get("/resume")
      .then((res) => setResume(res.data.hasResume ? res.data.resume : null))
      .finally(() => setLoading(false));
  };

  useEffect(loadResume, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please choose a resume file first.");
    setError("");
    setMessage("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResume(res.data.resume);
      setMessage("Resume uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setError("");
    setMessage("");
    setAnalyzing(true);
    try {
      const res = await api.post("/resume/analyze", { targetRole });
      setResume(res.data.resume);
      setMessage("Resume analyzed with AI successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <Loader />
    </AppLayout>
  );

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Resume & AI Analysis</h1>
      <p className="text-sm text-gray-500 mb-6">Upload your resume and get an AI-powered ATS score, strengths and suggestions.</p>

      <Alert type="error" message={error} />
      <Alert type="success" message={message} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">1. Upload Resume</h2>
          <form onSubmit={handleUpload} className="space-y-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600"
            />
            <button className="btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>

          {resume && (
            <div className="mt-4 text-sm text-gray-600 border-t pt-3">
              <p><strong>File:</strong> {resume.fileName}</p>
              <p><strong>Uploaded:</strong> {new Date(resume.uploadDate).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">2. Run AI Resume Analysis</h2>
          <input
            className="input-field mb-3"
            placeholder="Target Role (e.g. Frontend Developer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing || !resume}>
            {analyzing ? "Analyzing with Gemini..." : "Analyze with AI"}
          </button>
          {!resume && <p className="text-xs text-gray-400 mt-2">Upload a resume first.</p>}
        </div>
      </div>

      {resume?.analyzedAt && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">AI Analysis Result</h2>
            <span className="text-2xl font-bold text-primary">{resume.atsScore}/100</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{resume.analysisSummary}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-green-700 mb-1">Strengths</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {resume.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-1">Suggestions</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {resume.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-1">Missing Keywords</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {resume.missingKeywords?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
