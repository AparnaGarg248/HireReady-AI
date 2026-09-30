import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "Chitkara University",
    branch: "Computer Science Engineering",
    academicYear: "3rd Year"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg card">
        <h1 className="text-xl font-bold text-gray-900">Create HireReady AI Account</h1>
        <p className="text-sm text-gray-500 mb-6">Start building your placement readiness score today</p>

        <Alert message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" required className="input-field mt-1" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" required className="input-field mt-1" value={form.email} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required className="input-field mt-1" value={form.password} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="input-field mt-1"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Academic Year</label>
              <select name="academicYear" className="input-field mt-1" value={form.academicYear} onChange={handleChange}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Branch</label>
              <input name="branch" className="input-field mt-1" value={form.branch} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">College</label>
            <input name="college" className="input-field mt-1" value={form.college} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Register Account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already registered?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}