import React from 'react';

export default function StatCard({ icon: Icon, label, value, trend, colorClass = "bg-blue-50 text-brand-blue" }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-400 text-xs font-bold mb-1">{label}</p>
                <h3 className="text-2xl font-black text-[#000a2e]">{value}</h3>
                {trend && <span className="text-green-500 text-[10px] font-bold">{trend}</span>}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}
