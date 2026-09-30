import React from "react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
      {label}
    </div>
  );
}
