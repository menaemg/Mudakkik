import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { 
    Users, ShieldCheck, CreditCard, TrendingUp, 
    ArrowUpRight, Activity 
} from "lucide-react";

export default function Dashboard() {
    const borderVariants = {
        rest: { width: "0%", right: 0, opacity: 0 },
        hover: { width: "100%", opacity: 1, transition: { duration: 0.5, ease: "circOut" } }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black text-[#001246] tracking-tight">نظرة شاملة</h1>
                    <p className="text-slate-500 font-medium mt-1 italic">مرحباً بكِ مجدداً في نظام المـدقق الذكي.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#001246] hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Activity size={16} /> استخراج تقرير سريع
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <motion.div 
                    initial="rest" whileHover="hover" animate="rest"
                    className="bg-white p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden cursor-pointer"
                >
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">إجمالي المستخدمين</p>
                            <h2 className="text-5xl font-black bg-gradient-to-l from-[#001246] to-[#0055ff] bg-clip-text text-transparent mt-3 italic tracking-tighter">1,420</h2>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl text-[#001246]">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-green-500">
                        <ArrowUpRight size={16} /> <span>14.5%+ زيادة هذا الشهر</span>
                    </div>
                    <motion.div variants={borderVariants} className="absolute bottom-0 h-2 bg-gradient-to-r from-[#001246] to-[#0055ff]" />
                </motion.div>

            
                <motion.div 
                    initial="rest" whileHover="hover" animate="rest"
                    className="bg-white p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden cursor-pointer"
                >
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">طلبات الترقية</p>
                            <h2 className="text-5xl font-black text-[#D00000] mt-3 italic tracking-tighter">24</h2>
                        </div>
                        <div className="p-3 bg-red-50 rounded-2xl text-[#D00000]">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#D00000]">
                        <div className="w-2 h-2 bg-[#D00000] rounded-full animate-ping"></div> 
                        <span>8 طلبات بحاجة لمراجعة فورية</span>
                    </div>
                    <motion.div variants={borderVariants} className="absolute bottom-0 h-2 bg-gradient-to-r from-[#D00000] to-[#FF4D4D]" />
                </motion.div>

            
                <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-gradient-to-br from-[#001246] via-[#001b66] to-[#002a80] p-7 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 text-white relative overflow-hidden group cursor-pointer"
                >
                    <div className="relative z-10">
                        <p className="text-white/40 text-xs font-black uppercase tracking-widest text-left">Total Earnings</p>
                        <h2 className="text-5xl font-black mt-3 tracking-tighter italic font-mono">$18,240</h2>
                        <div className="mt-8 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold opacity-70">المستهدف الشهري</span>
                            <span className="text-xs font-black">75%</span>
                        </div>
                    </div>
                
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                    <CreditCard size={80} className="absolute -bottom-4 -left-4 text-white/5 -rotate-12 transition-transform group-hover:scale-110" />
                </motion.div>
            </div>

        
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-200/50 overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-black text-[#001246] text-lg flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#D00000] rounded-full shadow-[0_0_10px_#D00000]"></div>
                        أحدث نشاطات التدقيق
                    </h3>
                </div>
                <div className="p-20 text-center flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-slate-100 mb-6 shadow-xl shadow-blue-900/5">
                        <Activity className="text-[#001246] animate-pulse" size={32} />
                    </div>
                    <h4 className="text-[#001246] font-black text-xl mb-2 italic">جاري جلب البيانات الحية..</h4>
                    <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic text-sm">
                        نظام المـدقق يقوم بمزامنة العمليات الأخيرة من قاعدة البيانات الآن.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

Dashboard.layout = page => <AdminLayout children={page} />