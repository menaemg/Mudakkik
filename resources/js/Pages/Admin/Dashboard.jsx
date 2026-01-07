import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { Users, Newspaper, ShieldAlert, LayoutGrid, Activity } from "lucide-react";

export default function Dashboard({ 
    totalUsers, totalPosts, pendingUpgrades, postsStats, adsStats, plansChart, checkActivity 
}) {
    
    const postPie = [
        { name: "منشور", value: postsStats.published, color: "#10b981" },
        { name: "قيد المراجعة", value: postsStats.pending, color: "#3b82f6" },
    ];

    const adsPie = [
        { name: "مقبول", value: adsStats.approved, color: "#10b981" },
        { name: "قيد المراجعة", value: adsStats.pending, color: "#f59e0b" },
        { name: "مرفوض", value: adsStats.rejected, color: "#ef4444" },
    ];

    return (
        <div className="space-y-8 p-4 bg-[#fcfcfd]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="إجمالي المستخدمين" value={totalUsers} icon={<Users size={24}/>} color="bg-blue-600" />
                <StatCard title="إجمالي المقالات" value={totalPosts} icon={<Newspaper size={24}/>} color="bg-[#001246]" />
                <StatCard title="طلبات ترقية معلقة" value={pendingUpgrades} icon={<ShieldAlert size={24}/>} color="bg-red-500" isAlert />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-[#001246] mb-6">حالة المقالات</h3>
                    <div className="h-60">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={postPie} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                                    {postPie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                                </Pie>
                                <Tooltip cornerRadius={15} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <Legend items={postPie} />
                </motion.div>

                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-[#001246] mb-6">حالة الإعلانات</h3>
                    <div className="h-60">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={adsPie} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                                    {adsPie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                                </Pie>
                                <Tooltip cornerRadius={15} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <Legend items={adsPie} />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-[#001246] mb-8 flex items-center gap-2"><LayoutGrid size={20} className="text-blue-600"/> توزيع المشتركين (الباقات)</h3>
                    <div className="h-72">
                        <ResponsiveContainer>
                            <BarChart data={plansChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight:'bold'}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border:'none'}} />
                                <Bar dataKey="users" radius={[10, 10, 10, 10]} barSize={40}>
                                    {plansChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-[#001246] mb-8 flex items-center gap-2"><Activity size={20} className="text-blue-600"/> نشاط تدقيق الأخبار</h3>
                    <div className="h-72">
                        <ResponsiveContainer>
                            <AreaChart data={checkActivity}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#001246" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#001246" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '15px', border:'none'}} />
                                <Area type="monotone" dataKey="count" stroke="#001246" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, isAlert }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 relative group overflow-hidden">
            <div className={`w-16 h-16 rounded-[1.5rem] ${color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 z-10`}>
                {icon}
            </div>
            <div className="relative z-10">
                <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</h4>
                <p className="text-3xl font-black text-[#001246] mt-1">{value}</p>
            </div>
            {isAlert && <div className="absolute top-6 left-6 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>}
        </div>
    );
}

function Legend({ items }) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    {item.name}: {item.value}
                </div>
            ))}
        </div>
    );
}

Dashboard.layout = page => <AdminLayout children={page} />