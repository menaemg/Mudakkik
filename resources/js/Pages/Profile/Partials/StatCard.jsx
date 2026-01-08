import React from 'react';

export default function StatCard({ icon: Icon, label, value, trend, colorClass = "bg-blue-50 text-brand-blue" }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-white shadow-xl shadow-gray-200/40 flex items-center justify-between hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">

            <div className="absolute -right-10 -top-10 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 text-gray-400"></div>

            <div className="relative z-10">
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-[#020617] tracking-tight">{value}</h3>
                    {trend && <span className="text-emerald-500 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
                </div>
            </div>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-xl relative z-10 transition-transform group-hover:rotate-6 ${colorClass}`}>
                <Icon />
            </div>
        </div>
    );
}
