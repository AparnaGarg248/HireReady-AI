import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Loader from "../components/Loader.jsx";
import MetricCard from "../components/MetricCard.jsx";
import api from "../api/axios.js";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users")])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data.stats);
        setStudents(usersRes.data.students);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <Loader />
    </AppLayout>
  );

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
      <p className="text-sm text-gray-500 mb-6">Manage users and monitor placement readiness across the platform.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Students" value={stats?.totalStudents ?? 0} />
        <MetricCard title="Aptitude Attempts" value={stats?.totalAptitudeAttempts ?? 0} />
        <MetricCard title="Coding Attempts" value={stats?.totalCodingAttempts ?? 0} />
        <MetricCard title="Interviews Taken" value={stats?.totalInterviews ?? 0} />
        <MetricCard title="Avg Readiness" value={`${stats?.averageReadiness ?? 0}%`} />
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-gray-900 mb-3">Students</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Year</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="py-2 font-medium text-gray-900">{s.name}</td>
                <td className="text-gray-600">{s.email}</td>
                <td className="text-gray-600">{s.branch}</td>
                <td className="text-gray-600">{s.academicYear}</td>
                <td className="font-semibold text-primary">{s.overallScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
