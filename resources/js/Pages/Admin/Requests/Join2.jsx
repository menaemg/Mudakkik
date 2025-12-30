import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    UserPlus,
    Mail,
    Shield,
    Activity,
    Users,
    ShieldCheck,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";

export default function join() {
    const borderVariants = {
        rest: { width: "0%", right: 0, opacity: 0 },
        hover: {
            width: "100%",
            opacity: 1,
            transition: { duration: 0.5, ease: "circOut" },
        },
    };
    const dummyUsers = [
        {
            id: 1,
            name: "آية أحمد",
            email: "aya@audit.com",
            role: "ادمن ",
            status: "نشط",
            date: "2023-10-01",
        },
        {
            id: 2,
            name: "محمد علي",
            email: "m.ali@example.com",
            role: "مستخدم ",
            status: "نشط",
            date: "2023-11-15",
        },
        {
            id: 3,
            name: "سارة محمود",
            email: "sara.m@test.com",
            role: "صحفى",
            status: "معلق",
            date: "2023-12-05",
        },
        {
            id: 4,
            name: "عمر خالد",
            email: "omar@provider.net",
            role: "مستخدم ",
            status: "غير نشط",
            date: "2023-12-20",
        },
    ];

    return (
        <div className="space-y-8 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-black text-[#001246] tracking-tight">
                        إدارة طلبات الانضمام
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        عرض والتحكم ف طلبات الانضمام لمجتمع المدققين.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="bg-white p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden cursor-pointer"
                >
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                                إجمالي طلبات الانضمام
                            </p>
                            <h2 className="p-2 text-5xl font-black bg-gradient-to-l from-[#001246] to-[#0055ff] bg-clip-text text-transparent mt-3 mr-0.5 italic tracking-tighter">
                                1,420
                            </h2>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl text-[#001246]">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-green-500">
                        <ArrowUpRight size={16} />{" "}
                        <span>14.5%+ زيادة هذا الشهر</span>
                    </div>
                    <motion.div
                        variants={borderVariants}
                        className="absolute bottom-0 h-2 bg-gradient-to-r from-[#001246] to-[#0055ff]"
                    />
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    animate="rest"
                    className="bg-white p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden cursor-pointer"
                >
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                                طلبات قيد المراجعة
                            </p>
                            <h2 className="text-5xl font-black text-[#D00000] mt-3 italic tracking-tighter">
                                24
                            </h2>
                        </div>
                        <div className="p-3 bg-red-50 rounded-2xl text-[#D00000]">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#D00000]">
                        <div className="w-2 h-2 bg-[#D00000] rounded-full animate-ping"></div>
                        <span> يوجد طلبات بحاجة لمراجعة فورية</span>
                    </div>
                    <motion.div
                        variants={borderVariants}
                        className="absolute bottom-0 h-2 bg-gradient-to-r from-[#D00000] to-[#FF4D4D]"
                    />
                </motion.div>

                <motion.div className="bg-gradient-to-br from-[#001246] via-[#001b66] to-[#002a80] p-7 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 text-white relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <p className="text-white/40 text-xs font-black uppercase tracking-widest text-left">
                            Total Earnings
                        </p>
                        <h2 className="text-5xl font-black mt-3 tracking-tighter italic font-mono">
                            $18,240
                        </h2>
                        <div className="mt-8 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold opacity-70">
                                المستهدف الشهري
                            </span>
                            <span className="text-xs font-black">75%</span>
                        </div>
                    </div>

                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                    <CreditCard
                        size={80}
                        className="absolute -bottom-4 -left-4 text-white/5 -rotate-12 transition-transform group-hover:scale-110"
                    />
                </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/50 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-full md:w-96 focus-within:ring-2 ring-blue-900/5 transition-all">
                    <Search size={18} className="text-slate-400 ml-2" />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم، البريد، أو الرتبة..."
                        className="bg-transparent border-none outline-none text-sm w-full font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-[#001246] hover:bg-slate-50 transition-all">
                    <Filter size={18} /> تصفية النتائج
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-200/50 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[#001246] border-b border-slate-100">
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">
                                    المستخدم
                                </th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">
                                    الرتبة
                                </th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">
                                    تاريخ الانضمام
                                </th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider text-center">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dummyUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-blue-50/30 transition-all group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-[#001246] border border-white shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-[#001246]">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={12} />{" "}
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <Shield
                                                size={16}
                                                className="text-blue-600"
                                            />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span
                                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                                                user.status === "نشط"
                                                    ? "bg-green-100 text-green-600"
                                                    : user.status === "معلق"
                                                    ? "bg-orange-100 text-orange-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">
                                        {user.date}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="تعديل"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="p-2.5 text-slate-400 hover:text-[#D00000] hover:bg-red-50 rounded-xl transition-all"
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer الجدول (Pagination) */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 italic">
                        عرض 1 إلى 4 من أصل 4 مستخدمين
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-400 cursor-not-allowed">
                            السابق
                        </button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-[#001246] hover:bg-[#001246] hover:text-white transition-all">
                            التالي
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

join.layout = (page) => <AdminLayout children={page} />;
