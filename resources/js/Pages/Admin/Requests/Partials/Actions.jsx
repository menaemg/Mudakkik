import React from "react";

export function ActionIcon({ icon, color, onClick }) {
  const styles = {
    blue: "text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white",
    green:
      "text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white",
    red: "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white",
    gray: "text-gray-600 bg-gray-50 hover:bg-gray-600 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-[1rem] transition-all ${styles[color]}`}
    >
      {icon}
    </button>
  );
}

const DetailRow = ({ label, value, icon, labelColor, valueColor }) => (
  <div className="flex justify-between items-center text-sm font-black py-1">
    <span
      className={`${
        labelColor ? labelColor : "text-slate-400"
      } flex items-center gap-1`}
    >
      {icon} {label}
    </span>
    <span className={`${valueColor || "text-[#001246]"} `}>{value}</span>
  </div>
);

const ActionButton = ({ color, text, onClick }) => {
  const colors = {
    green: "bg-emerald-600 active:bg-emerald-800 hover:bg-emerald-700",
    red: "bg-red-600 active:bg-red-800 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-white font-black rounded-[1.5rem] shadow-lg transition-all active:scale-95 ${colors[color]}`}
    >
      {text}
    </button>
  );
};

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
    <h4 className="text-xs font-black text-slate-400 mb-4 flex items-center gap-2">
      {icon} {title}
    </h4>
    {children}
  </div>
);
export { DetailRow, ActionButton, InfoCard };
