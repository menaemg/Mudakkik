import React from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Shield, Mail, Lock, User, Star, CheckCircle } from "lucide-react";

export default function UserCreateModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        role: "مستخدم", 
        bio: "",
        credibility_score: 0,
        is_verified_journalist: false,
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => {
                reset(); 
                onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#001246]/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 font-sans"
                    >
                     
                        <div className="bg-[#001246] p-8 text-white flex justify-between items-center" dir="rtl">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#D00000] rounded-2xl shadow-lg shadow-red-900/40">
                                    <UserPlus size={24} />
                                </div>
                                <h3 className="text-xl font-black">إضافة عضو جديد للمنصة</h3>
                            </div>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={28} />
                            </button>
                        </div>


                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar" dir="rtl">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                            
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">الاسم الكامل</label>
                                    <input 
                                        type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all" 
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
                                </div>

                              
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">اسم المستخدم (@)</label>
                                    <input 
                                        type="text" value={data.username} onChange={e => setData('username', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all" 
                                    />
                                    {errors.username && <p className="text-red-500 text-xs font-bold">{errors.username}</p>}
                                </div>

                            
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-black text-[#001246]">البريد الإلكتروني</label>
                                    <input 
                                        type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all" 
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">نوع الحساب</label>
                                    <select 
                                        value={data.role} onChange={e => setData('role', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="مستخدم">مستخدم عادى</option>
                                        <option value="صحفى">صحفى</option>
                                        <option value="ادمن">ادمن (مدير)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">كلمة المرور</label>
                                    <input 
                                        type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all" 
                                    />
                                    {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password}</p>}
                                </div>
                 
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">تأكيد كلمة المرور</label>
                                    <input 
                                        type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all" 
                                    />
                                </div>
                            </div>
                            {data.role === "صحفى" && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-black text-blue-900 flex items-center gap-2">
                                            <Star size={16} className="text-amber-500" /> نقاط المصداقية
                                        </label>
                                        <input 
                                            type="number" min="0" max="100"
                                            value={data.credibility_score} onChange={e => setData('credibility_score', e.target.value)}
                                            className="w-full p-3 bg-white border-2 border-blue-100 rounded-xl font-bold outline-none" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-8 justify-end">
                                        <span className="text-sm font-black text-blue-900">توثيق الصحفي</span>
                                        <input 
                                            type="checkbox" checked={data.is_verified_journalist}
                                            onChange={e => setData('is_verified_journalist', e.target.checked)}
                                            className="w-6 h-6 rounded border-blue-300 text-[#D00000] focus:ring-[#D00000]"
                                        />
                                    </div>
                                </motion.div>
                            )}

                      
                            <div className="space-y-2 text-right">
                                <label className="text-sm font-black text-[#001246]">النبذة التعريفية (Bio)</label>
                                <textarea 
                                    value={data.bio} onChange={e => setData('bio', e.target.value)}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold h-24"
                                    placeholder="اكتب شيئاً عن المستخدم..."
                                />
                            </div>

                         
                            <button 
                                disabled={processing}
                                className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl shadow-blue-900/20 hover:bg-[#D00000] transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? "جاري الحفظ..." : "تأكيد وإضافة المستخدم"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}