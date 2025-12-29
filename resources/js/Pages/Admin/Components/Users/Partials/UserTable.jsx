import React from "react";
import { EyeIcon, Edit2, Trash2, Calendar, CheckCircle2 } from "lucide-react";

export default function UserTable({ users, getRoleBadge, onView, onEdit, onDelete }) {

    const roleLabels = {
        admin: 'مدير',
        journalist: 'صحفي',
        user: 'مستخدم',
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[900px]">
                <thead>
                    <tr className="bg-slate-50/80 text-[#001246] border-b border-slate-100">
                        <th className="px-10 py-7 font-black text-sm uppercase">المستخدم</th>
                        <th className="px-10 py-7 font-black text-sm text-center">الرتبة</th>
                        <th className="px-10 py-7 font-black text-sm text-center">التاريخ</th>
                        <th className="px-10 py-7 font-black text-sm text-center">الحالة</th>
                        <th className="px-10 py-7 font-black text-sm text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                      
                            <td className="px-10 py-7">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-[1.2rem] bg-[#001246] flex items-center justify-center font-black text-white text-xl border-2 border-white shadow-md">
                                        {user.name?.[0]}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[17px] font-black text-[#001246] group-hover:text-[#D00000] transition-colors">
                                            {user.name}
                                        </div>
                                        <div className="text-[13px] text-slate-400 font-bold mt-0.5">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-10 py-7 text-center">
                                <span className={`inline-flex px-5 py-2 rounded-xl text-[12px] font-black border ${getRoleBadge(user.role)}`}>
                                    {roleLabels[user.role] || user.role}
                                </span>
                            </td>

                            <td className="px-10 py-7 text-center">
                                <div className="inline-flex items-center gap-2 text-sm font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Calendar size={14} className="text-[#D00000]" />
                                    {new Date(user.created_at).toLocaleDateString("ar-EG")}
                                </div>
                            </td>

                        
                            <td className="px-10 py-7 text-center">
                                {user.email_verified_at ? (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-full border border-emerald-200">
                                        <CheckCircle2 size={14} /> موثق
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-black text-amber-700 bg-amber-100/50 px-3 py-1.5 rounded-full border border-amber-200">
                                        قيد الانتظار
                                    </span>
                                )}
                            </td>

                    
                            <td className="px-10 py-7 text-center">
                                <div className="flex justify-center items-center gap-3">
                                    <button 
                                        onClick={() => onView(user)} 
                                        className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-[1rem] transition-all"
                                    >
                                        <EyeIcon size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onEdit(user)} 
                                        className="p-3 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-[1rem] transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(user)} 
                                        className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-[1rem] transition-all"
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
    );
}