import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, icon }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700",
    linkedin: "bg-[#0077b5] text-white hover:bg-[#006396]",
    google: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {icon} {children}
    </button>
  );
};

export const Badge = ({ children, color = 'indigo' }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-slate-100 text-slate-800",
    orange: "bg-orange-100 text-orange-800",
    white: "bg-white/90 text-slate-800 backdrop-blur"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color]}`}>{children}</span>;
};