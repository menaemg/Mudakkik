// MainCard.jsx
import React from 'react';

export default function ProfileLayout({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden flex flex-col min-h-[calc(100vh-16rem)] animate-in fade-in duration-700 slide-in-from-bottom-4 ${className}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>

        {children}
    </div>
  );
}
