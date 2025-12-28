import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Layers,
    Hash,
    AlignRight,
    FileText,
    Calendar,
    Info,
} from "lucide-react";

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "تاريخ غير صالح"
            : date.toLocaleDateString("ar-EG");
    } catch (error) {
        return "تاريخ غير صالح";
    }
};

export default function CategoryViewModal({ isOpen, category, onClose }) {
    if (!isOpen || !category) return null;
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
                        <div
                            className="bg-[#001246] p-10 text-white relative text-right"
                            dir="rtl"
                        >
                            <button
                                onClick={onClose}
                                aria-label="إغلاق النافذة"
                                className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>

                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[#D00000] rounded-2xl shadow-lg shadow-red-950/40">
                                    <Layers size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/50 text-sm font-bold mt-1 flex items-center gap-1">
                                        <Hash size={14} /> {category.slug}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-8 text-right" dir="rtl">
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard
                                    icon={<FileText size={16} />}
                                    label="إجمالي المقالات"
                                    value={category.posts_count}
                                    color="text-blue-600"
                                />
                                <StatCard
                                    icon={<Calendar size={16} />}
                                    label="تاريخ الإنشاء"
                                    value={formatDate(category.created_at)}
                                    color="text-emerald-600"
                                />
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 mb-2 flex items-center gap-2">
                                    <AlignRight size={14} /> وصف الفئة
                                </h4>
                                <p className="text-[#001246] font-bold leading-relaxed">
                                    {category.description ||
                                        "لا يوجد وصف مضاف لهذه الفئة حالياً."}
                                </p>
                            </div>

                            <div className="space-y-4 px-2">
                                <DetailRow
                                    label="المعرف الرقمي"
                                    value={`#${category.id}`}
                                />
                                <DetailRow
                                    label="آخر تحديث"
                                    value={new Date(
                                        category.updated_at
                                    ).toLocaleDateString("ar-EG")}
                                />
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl hover:bg-[#D00000] transition-all active:scale-95"
                            >
                                إغلاق النافذة
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
        <p className="text-[10px] font-black uppercase mb-1 flex items-center justify-center gap-1 opacity-60 text-slate-500">
            {icon} {label}
        </p>
        <p className={`text-2xl font-black ${color}`}>{value ?? 0}</p>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm font-black border-b border-slate-50 pb-2">
        <span className="text-slate-400">{label}</span>
        <span className="text-[#001246]">{value}</span>
    </div>
);
