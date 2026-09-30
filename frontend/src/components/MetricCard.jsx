import React from "react";

export default function MetricCard({ title, value, subtitle, badge }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
        {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{badge}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
