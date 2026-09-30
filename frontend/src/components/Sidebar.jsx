import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resume", label: "Resume & AI Analysis" },
  { to: "/aptitude", label: "Aptitude Tests" },
  { to: "/coding", label: "Coding Assessment" },
  { to: "/interview", label: "AI Mock HR Interview" },
  { to: "/roadmap", label: "Personalized AI Roadmap" },
  { to: "/analytics", label: "Career Analytics" },
  { to: "/profile", label: "My Profile" }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold">HireReady AI</h1>
        <p className="text-xs text-gray-300">Placement Platform</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition ${
                isActive ? "bg-accent text-white" : "text-gray-200 hover:bg-white/10"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition ${
                isActive ? "bg-accent text-white" : "text-gray-200 hover:bg-white/10"
              }`
            }
          >
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        <button onClick={handleLogout} className="mt-3 text-xs text-accent hover:underline">
          Logout
        </button>
      </div>
    </aside>
  );
}
