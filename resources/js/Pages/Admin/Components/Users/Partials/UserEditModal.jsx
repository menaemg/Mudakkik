import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    Edit3,
    User,
    Mail,
    Shield,
    Star,
    FileText,
} from "lucide-react";

export default function UserEditModal({ isOpen, user, onClose }) {
    const { data, setData, put, processing, errors, reset,clearErrors } = useForm({
        name: "",
        email: "",
        username: "",
        role: "user",
        bio: "",
        credibility_score: 0,
        is_verified_journalist: false,
    });

    useEffect(() => {
        if (user && isOpen) {
            setData({
                name: user.name || "",
                email: user.email || "",
                username: user.username || "",
                role: user.role || "user",
                bio: user.bio || "",
                credibility_score: user.credibility_score || 0,
                is_verified_journalist: !!user.is_verified_journalist,
            });
        }
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [user, isOpen, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user?.id) return;
        put(route("admin.users.update", user.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#001246]/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 font-sans"
                    >
                        <div
                            className="bg-[#001246] p-8 text-white flex justify-between items-center"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-900/40">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">
                                        تعديل بيانات الحساب
                                    </h3>
                                    <p className="text-xs text-white/60 font-bold">
                                        تحديث معلومات: {user?.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="إغلاق النافذة" 
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
                            dir="rtl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <User
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 outline-none font-bold transition-all"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs font-bold">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <Shield
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        اسم المستخدم (@)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 outline-none font-bold transition-all"
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs font-bold">
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <Mail
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 outline-none font-bold transition-all"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs font-bold">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246]">
                                        نوع الحساب (الصلاحية)
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 outline-none font-bold cursor-pointer"
                                    >
                                        <option value="user">مستخدم</option>
                                        <option value="journalist">صحفى</option>
                                        <option value="admin">ادمن</option>
                                    </select>
                                </div>
                            </div>

                            {data.role === "journalist" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-6 bg-amber-50 rounded-[2rem] border-2 border-dashed border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-black text-amber-900 flex items-center gap-2">
                                            <Star
                                                size={16}
                                                className="text-amber-600"
                                            />{" "}
                                            نقاط المصداقية الحالية
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.credibility_score}
                                            onChange={(e) =>
                                                setData(
                                                    "credibility_score",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-3 bg-white border-2 border-amber-100 rounded-xl font-bold outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-8 justify-end">
                                        <span className="text-sm text-amber-900 font-bold">
                                            توثيق الحساب كصحفي
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={
                                                data.is_verified_journalist
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "is_verified_journalist",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-6 h-6 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-2 text-right">
                                <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                    <FileText
                                        size={16}
                                        className="text-[#D00000]"
                                    />{" "}
                                    النبذة التعريفية
                                </label>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) =>
                                        setData("bio", e.target.value)
                                    }
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 outline-none font-bold h-24"
                                />
                            </div>
                            <button
                                disabled={processing}
                                className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing
                                    ? "جاري التحديث..."
                                    : "حفظ التغييرات الجديدة"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
