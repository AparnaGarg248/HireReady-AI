import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import AppLayout from "../components/AppLayout.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [aptitudeAnalytics, setAptitudeAnalytics] = useState(null);
  const [codingHistory, setCodingHistory] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/aptitude/analytics"), api.get("/coding/history"), api.get("/readiness")])
      .then(([apt, coding, ready]) => {
        setAptitudeAnalytics(apt.data);
        setCodingHistory(coding.data.history || []);
        setReadiness(ready.data.readiness);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <Loader />
    </AppLayout>
  );

  const aptitudeLineData = {
    labels: aptitudeAnalytics?.chartData?.labels || [],
    datasets: [
      {
        label: "Aptitude Percentage",
        data: aptitudeAnalytics?.chartData?.percentages || [],
        borderColor: "#0f172a",
        backgroundColor: "#0f172a",
        tension: 0.3
      }
    ]
  };

  const codingBarData = {
    labels: codingHistory.map((c) => c.problemTitle).reverse(),
    datasets: [
      {
        label: "Coding Score (%)",
        data: codingHistory.map((c) => c.score).reverse(),
        backgroundColor: "#ea580c"
      }
    ]
  };

  const readinessDoughnut = {
    labels: ["Resume", "Coding", "Aptitude", "Interview"],
    datasets: [
      {
        data: [readiness?.resumeScore || 0, readiness?.codingScore || 0, readiness?.aptitudeScore || 0, readiness?.interviewScore || 0],
        backgroundColor: ["#0f172a", "#ea580c", "#2563eb", "#16a34a"]
      }
    ]
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Career Analytics Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Visual trends across all your assessments.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Aptitude Progress</h2>
          {aptitudeAnalytics?.hasAttempts ? <Line data={aptitudeLineData} /> : <p className="text-sm text-gray-400">No aptitude attempts yet.</p>}
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Readiness Breakdown</h2>
          <Doughnut data={readinessDoughnut} />
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Coding Assessment Scores</h2>
        {codingHistory.length > 0 ? <Bar data={codingBarData} /> : <p className="text-sm text-gray-400">No coding submissions yet.</p>}
      </div>
    </AppLayout>
  );
}
