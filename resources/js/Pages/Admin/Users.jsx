import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Edit2, Trash2, UserPlus, Mail, Shield } from "lucide-react";

export default function Users() {
    const dummyUsers = [
        { id: 1, name: "آية أحمد", email: "aya@audit.com", role: "ادمن ", status: "نشط", date: "2023-10-01" },
        { id: 2, name: "محمد علي", email: "m.ali@example.com", role: "مستخدم ", status: "نشط", date: "2023-11-15" },
        { id: 3, name: "سارة محمود", email: "sara.m@test.com", role: "صحفى", status: "معلق", date: "2023-12-05" },
        { id: 4, name: "عمر خالد", email: "omar@provider.net", role: "مستخدم ", status: "غير نشط", date: "2023-12-20" },
    ];

    return (
        
        <div className="space-y-8 ">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black text-[#001246] tracking-tight">إدارة المستخدمين</h1>
                    <p className="text-slate-500 font-medium mt-1">عرض والتحكم في صلاحيات أعضاء منصة المـدقق.</p>
                </motion.div>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-[#D00000] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-red-900/20 transition-all"
                >
                    <UserPlus size={20} />
                    <span>إضافة مستخدم جديد</span>
                </motion.button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/50 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-full md:w-96 focus-within:ring-2 ring-blue-900/5 transition-all">
                    <Search size={18} className="text-slate-400 ml-2" />
                    <input type="text" placeholder="ابحث بالاسم، البريد، أو الرتبة..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
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
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">المستخدم</th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">الرتبة</th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">الحالة</th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider">تاريخ الانضمام</th>
                                <th className="px-8 py-5 font-black text-sm uppercase tracking-wider text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dummyUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-[#001246] border border-white shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-[#001246]">{user.name}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <Shield size={16} className="text-blue-600" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                                            user.status === 'نشط' ? 'bg-green-100 text-green-600' : 
                                            user.status === 'معلق' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">
                                        {user.date}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="تعديل">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2.5 text-slate-400 hover:text-[#D00000] hover:bg-red-50 rounded-xl transition-all" title="حذف">
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
                    <p className="text-xs font-bold text-slate-400 italic">عرض 1 إلى 4 من أصل 4 مستخدمين</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-400 cursor-not-allowed">السابق</button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-[#001246] hover:bg-[#001246] hover:text-white transition-all">التالي</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

Users.layout = page => <AdminLayout children={page} />