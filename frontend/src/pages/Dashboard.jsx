import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import ScoreGauge from "../components/ScoreGauge.jsx";
import MetricCard from "../components/MetricCard.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <Loader label="Loading your dashboard..." />
    </AppLayout>
  );

  const readiness = data?.readiness || {};

  return (
    <AppLayout>
      <div className="mb-6">
        <p className="text-sm text-accent font-medium">Placement Preparation 2026</p>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your centralized AI placement assistant is tracking your readiness across Resume, Coding, Aptitude and HR Interview rounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
        <div className="card flex flex-col items-center justify-center lg:col-span-1">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Overall Placement Readiness</p>
          <ScoreGauge score={readiness.overallScore || 0} label="" />
          <Link to="/roadmap" className="btn-primary mt-3 text-xs">
            View AI Roadmap
          </Link>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <MetricCard title="Resume ATS Score" value={`${readiness.resumeScore || 0}/100`} subtitle="Weightage: 20%" badge={data?.resume?.analyzed ? "Analyzed" : "Needs Work"} />
          <MetricCard title="Coding Assessment" value={`${readiness.codingScore || 0}%`} subtitle="Weightage: 30%" badge="Judge0 Evaluated" />
          <MetricCard title="Aptitude Mastery" value={`${readiness.aptitudeScore || 0}%`} subtitle="Weightage: 25%" badge="Quant, Logical, Verbal" />
          <MetricCard title="AI HR Interview" value={`${readiness.interviewScore || 0}%`} subtitle="Weightage: 25%" badge="Gemini Feedback" />
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Placement Action Modules</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Link to="/resume" className="btn-outline text-center">Upload Resume</Link>
          <Link to="/aptitude" className="btn-outline text-center">Aptitude Test</Link>
          <Link to="/coding" className="btn-outline text-center">Coding Test</Link>
          <Link to="/interview" className="btn-outline text-center">AI HR Interview</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Latest Aptitude Attempt</h2>
          {data?.aptitude?.latest ? (
            <p className="text-sm text-gray-600">
              {data.aptitude.latest.category}: {data.aptitude.latest.correctAnswers}/{data.aptitude.latest.totalQuestions} correct (
              {data.aptitude.latest.percentage}%)
            </p>
          ) : (
            <p className="text-sm text-gray-400">No attempts yet.</p>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Latest Coding Submission</h2>
          {data?.coding?.latest ? (
            <p className="text-sm text-gray-600">
              {data.coding.latest.problemTitle} ({data.coding.latest.language}) - {data.coding.latest.passedTestCases}/
              {data.coding.latest.totalTestCases} test cases passed
            </p>
          ) : (
            <p className="text-sm text-gray-400">No submissions yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
