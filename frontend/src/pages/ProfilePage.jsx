import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => setForm(res.data.user))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await api.put("/auth/profile", form);
      setUser(res.data.user);
      localStorage.setItem("hireready_user", JSON.stringify(res.data.user));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return (
    <AppLayout>
      <Loader />
    </AppLayout>
  );

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
      <p className="text-sm text-gray-500 mb-6">Update your academic and contact details.</p>

      <Alert type="error" message={error} />
      <Alert type="success" message={message} />

      <form onSubmit={handleSubmit} className="card max-w-lg space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input name="name" className="input-field mt-1" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input className="input-field mt-1 bg-gray-100" value={form.email} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">College</label>
          <input name="college" className="input-field mt-1" value={form.college} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <input name="branch" className="input-field mt-1" value={form.branch} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Academic Year</label>
            <input name="academicYear" className="input-field mt-1" value={form.academicYear} onChange={handleChange} />
          </div>
        </div>
        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </AppLayout>
  );
}
