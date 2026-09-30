import React from "react";

export default function ScoreGauge({ score = 0, label = "Overall Score" }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#ea580c" : "#dc2626";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">
          {score}
        </text>
        <text x="70" y="85" textAnchor="middle" fontSize="11" fill="#6b7280">
          OUT OF 100
        </text>
      </svg>
      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
