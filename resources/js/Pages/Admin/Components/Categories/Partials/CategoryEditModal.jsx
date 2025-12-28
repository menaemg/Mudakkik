import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Edit3, Tag, Link2, AlignRight } from "lucide-react";

export default function CategoryEditModal({ isOpen, category, onClose }) {
    const { data, setData, put, processing, errors, reset,clearErrors } = useForm({
        name: "",
        slug: "",
        description: "",
    });

    useEffect(() => {
        if (category && isOpen) {
            setData({
                name: category.name || "",
                slug: category.slug || "",
                description: category.description || "",
            });
        }
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [category, isOpen,setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category?.id) return;
        put(route("admin.categories.update", category.id), {
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
                        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white/20 font-sans"
                    >
                        <div
                            className="bg-[#001246] p-8 text-white flex justify-between items-center"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/40">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">
                                        تعديل بيانات الفئة
                                    </h3>
                                    <p className="text-xs text-white/60 font-bold">
                                        تحديث: {category?.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-8 space-y-6"
                            dir="rtl"
                        >
                            <div className="space-y-6 text-right">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <Tag
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        اسم الفئة
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold transition-all"
                                        placeholder="مثال: أخبار الرياضة"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs font-bold pr-2">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <Link2
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        الرابط المختصر (Slug)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold transition-all"
                                        placeholder="مثال: اخبار-الرياضة"
                                    />
                                    <p className="text-[10px] text-slate-400 font-bold pr-2">
                                        نصيحة: استخدم الشرطة (-) بدلاً من
                                        المسافة.
                                    </p>
                                    {errors.slug && (
                                        <p className="text-red-500 text-xs font-bold pr-2">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <AlignRight
                                            size={16}
                                            className="text-[#D00000]"
                                        />{" "}
                                        وصف الفئة
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold h-32 resize-none"
                                        placeholder="اكتب وصفاً مختصراً لمحتوى الفئة..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-xs font-bold pr-2">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={processing}
                                className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {processing ? "جاري الحفظ..." : "حفظ التعديلات"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
