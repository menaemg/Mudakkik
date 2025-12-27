import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Users, FileText, Heart, UserPlus, Star, Info } from "lucide-react";

export default function UserViewModal({ isOpen, user, onClose, getRoleBadge }) {
    if (!user) return null;

    const roleLabels = {
        admin: 'مدير',
        journalist: 'صحفي',
        user: 'مستخدم',
    };

    return (
        <AnimatePresence>
            {isOpen && (
             
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001246]/70 backdrop-blur-lg font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }} 
                        className="bg-white rounded-[3.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-white/20"
                    >
                      
                       
                        <div className="bg-[#001246] p-10 text-white relative text-right" dir="rtl">
                            <button onClick={onClose} className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors">
                                <X size={28} />
                            </button>
                            
                            <div className="flex items-center gap-6 mb-6">
                               
                                <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-4xl font-black border border-white/20 shadow-inner">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{user.name}</h3>
                                    <p className="text-blue-300 text-[15px] font-bold mt-1 opacity-80">@{user.username}</p>
                                    
                                   
                                    <span className={`inline-block mt-3 px-4 py-1 rounded-xl text-[11px] font-black border ${getRoleBadge(user.role)}`}>
                                        {roleLabels[user.role] || user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-8 text-right" dir="rtl">
                           
                            {user.bio && (
                                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 mb-2 flex items-center gap-2">
                                        <Info size={14} /> نبذة تعريفية
                                    </h4>
                                    <p className="text-[#001246] font-bold leading-relaxed">{user.bio}</p>
                                </div>
                            )}

                         
                            <div className="grid grid-cols-2 gap-4">
                                {user.role === "journalist" ? (
                                  
                                    <>
                                        <StatCard icon={<FileText size={18} />} label="المقالات" value={user.posts_count} color="text-blue-600" />
                                        <StatCard icon={<Users size={18} />} label="المتابعين له" value={user.followers_count} color="text-emerald-600" />
                                        <StatCard icon={<UserPlus size={18} />} label="يتابعهم" value={user.following_count} color="text-[#001246]" />

                                        <div className="bg-amber-50 p-5 rounded-[1.8rem] border border-amber-100 text-center col-span-1">
                                            <p className="text-[10px] font-black text-amber-600 uppercase mb-1 flex items-center justify-center gap-1">
                                                <Star size={12} fill="currentColor" /> المصداقية
                                            </p>
                                            <p className="text-2xl font-black text-amber-700">%{user.credibility_score || 0}</p>
                                        </div>
                                    </>
                                ) : (
                                  
                                    <>
                                        <StatCard icon={<Heart size={18} />} label="الإعجابات" value={user.likes_count} color="text-[#D00000]" />
                                        <StatCard icon={<UserPlus size={18} />} label="يتابعهم" value={user.following_count} color="text-[#001246]" />
                                    </>
                                )}
                            </div>

                           
                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <DetailRow label="البريد الإلكتروني" value={user.email} />
                                <DetailRow label="تاريخ الانضمام" value={new Date(user.created_at).toLocaleDateString("ar-EG")} />
                            </div>

                            <button onClick={onClose} className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl hover:bg-[#D00000] transition-all active:scale-95">
                                إغلاق الملف الشخصي
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-slate-50 p-5 rounded-[1.8rem] border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all">
        <p className={`text-[10px] font-black uppercase mb-1 flex items-center justify-center gap-1 opacity-60`}>
            {icon} {label}
        </p>
        <p className={`text-2xl font-black ${color}`}>{value || 0}</p>
    </div>
);


const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm font-black">
        <span className="text-slate-400">{label}</span>
        <span className="text-[#001246]">{value}</span>
    </div>
);