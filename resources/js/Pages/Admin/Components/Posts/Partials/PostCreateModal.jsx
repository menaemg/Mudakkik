import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Upload,
    Save,
    Tag,
    FileText,
    Layout,
    CheckCircle,
    Image as ImageIcon,
} from "lucide-react";

export default function PostCreateModal({ isOpen, onClose, categories, tags }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        body: "",
        category_id: "",
        tags: [],
        image: null,
        status: "published",
        is_featured: false,
    });

    const [preview, setPreview] = useState(null);

    const toggleTag = (id) => {
        const newTags = data.tags.includes(id)
            ? data.tags.filter((t) => t !== id)
            : [...data.tags, id];
        setData("tags", newTags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.posts.store"), {
            onSuccess: () => {
                reset();
                setPreview(null);
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
                        className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-white/20 font-sans flex flex-col max-h-[90vh]"
                    >
                        <div
                            className="bg-[#001246] p-8 text-white flex justify-between items-center"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#D00000] rounded-2xl shadow-lg shadow-red-900/40">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white">
                                    إنشاء مقال إخباري جديد
                                </h3>
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
                            className="p-8 space-y-6 overflow-y-auto custom-scrollbar"
                            dir="rtl text-right"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2 justify-end">
                                        عنوان المقال{" "}
                                        <Layout
                                            size={16}
                                            className="text-[#D00000]"
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="اكتب عنواناً جذاباً..."
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all text-right"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-xs font-bold">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 text-right">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2 justify-end">
                                        القسم الرئيسي{" "}
                                        <CheckCircle
                                            size={16}
                                            className="text-[#D00000]"
                                        />
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all appearance-none cursor-pointer text-right"
                                    >
                                        <option value="">اختر القسم...</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}{" "}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-500 text-xs font-bold">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-sm font-black text-[#001246] flex items-center gap-2 justify-end">
                                    صورة الغلاف{" "}
                                    <ImageIcon
                                        size={16}
                                        className="text-[#D00000]"
                                    />
                                </label>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <label className="flex-1 w-full border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center cursor-pointer hover:bg-slate-50 transition-all group">
                                        <Upload
                                            className="text-slate-300 group-hover:text-[#D00000] mb-2"
                                            size={32}
                                        />
                                        <span className="text-xs font-black text-slate-500">
                                            اضغط لرفع صورة عالية الجودة
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setData("image", file);
                                                setPreview(
                                                    URL.createObjectURL(file)
                                                );
                                            }}
                                        />
                                    </label>
                                    {preview && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="relative group w-full md:w-40 h-40"
                                        >
                                            <img
                                                src={preview}
                                                className="w-full h-full object-cover rounded-[1.5rem] border-4 border-white shadow-lg"
                                            />
                                            <button
                                                onClick={() => {
                                                    setPreview(null);
                                                    setData("image", null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-xs font-bold">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 text-right">
                                <label className="text-sm font-black text-[#001246] flex items-center gap-2 justify-end text-right">
                                    الوسوم ذات الصلة{" "}
                                    <Tag size={16} className="text-[#D00000]" />
                                </label>
                                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-[1.8rem] border-2 border-slate-100">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.id)}
                                            className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
                                                data.tags.includes(tag.id)
                                                    ? "bg-[#D00000] text-white shadow-md"
                                                    : "bg-white text-slate-500 border border-slate-200 hover:border-[#D00000]"
                                            }`}
                                        >
                                            {tag.name} #
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-sm font-black text-[#001246]">
                                    تفاصيل المقال
                                </label>
                                <textarea
                                    rows="5"
                                    value={data.body}
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
                                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-[#D00000] outline-none font-bold transition-all h-40 resize-none text-right"
                                    placeholder="ابدأ بكتابة القصة..."
                                />
                                {errors.body && (
                                    <p className="text-red-500 text-xs font-bold">
                                        {errors.body}
                                    </p>
                                )}
                            </div>

                            <button
                                disabled={processing}
                                className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl shadow-blue-900/20 hover:bg-[#D00000] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <Save size={22} />
                                {processing
                                    ? "جاري النشر..."
                                    : "نشر المقال الآن"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
