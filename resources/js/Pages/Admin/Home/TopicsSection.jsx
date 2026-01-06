import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Eye, LayoutGrid, Info, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";

const getImagePath = (path) => {
    if (!path) return '/assets/images/post.webp';
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function TopicsSection({ alertsData, categories }) {
    const [previewPost, setPreviewPost] = useState(null);

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                image: getImagePath(post.image),
                raw: post
            })));
    };

    const handleUpdate = (slotName, option) => {
        if (!option) return;
        router.post(route('admin.home.topics.update'), {
            section: 'editor_alerts',
            slot_name: slotName,
            post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (slotName) => {
        router.post(route('admin.home.topics.update'), {
            section: 'editor_alerts',
            slot_name: slotName,
            post_id: null
        }, { preserveScroll: true });
    };

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة قسم المواضيع والتنبيهات" />

            <div className="py-8 mb-8 border-b border-slate-200/60 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                        <div className="p-2 bg-brand-red/10 rounded-xl">
                            <LayoutGrid className="text-brand-red" size={32} />
                        </div>
                        إدارة قسم المواضيع والتنبيهات
                    </h1>
                    <p className="text-slate-500 font-bold mt-2">تحكم في تنبيهات المحرر المصورة وترتيب الأقسام الذكي.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-[#001246] flex items-center gap-2">
                                <Bell className="text-amber-500 animate-swing" size={24} />
                                تنبيهات المحرر المصورة
                            </h2>
                            <Badge variant="outline" className="text-slate-400 border-slate-200 uppercase tracking-widest text-[10px]">
                                Manual Selection
                            </Badge>
                        </div>

                        <div className="space-y-6">
                            {alertsData.map((slot, index) => (
                                <div key={index} className="group relative bg-slate-50/50 rounded-[2rem] p-6 border-2 border-dashed border-slate-200 hover:border-brand-red/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">

                                        <div className="relative w-full md:w-40 h-28 rounded-2xl overflow-hidden bg-slate-200 shadow-inner group-hover:shadow-lg transition-shadow shrink-0">
                                            <img
                                                src={getImagePath(slot.post?.image)}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {slot.post && (
                                                <button
                                                    onClick={() => setPreviewPost(slot.post)}
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">مكان التنبيه {slot.slot_name}#</span>
                                                {slot.post && (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-bold">نشط الآن</Badge>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <AsyncSelect
                                                        cacheOptions
                                                        loadOptions={loadOptions}
                                                        onChange={(opt) => handleUpdate(slot.slot_name, opt)}
                                                        placeholder="ابحث عن عنوان المقال..."
                                                        className="text-sm font-bold"
                                                        styles={{
                                                            control: (base) => ({ ...base, borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2px' }),
                                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                                        }}
                                                        menuPortalTarget={document.body}
                                                    />
                                                </div>
                                                {slot.post && (
                                                    <button
                                                        onClick={() => handleReset(slot.slot_name)}
                                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                                        title="إزالة الخبر"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {slot.post && (
                                        <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                            <p className="text-sm font-black text-[#001246] line-clamp-1">{slot.post.title}</p>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <ExternalLink size={10} /> {slot.post.category?.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#001246] p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <Info size={22} className="text-blue-400" /> الحالة الذكية للأقسام
                            </h2>
                            <p className="text-blue-200/60 text-xs font-bold mb-8">يتم ترتيب السلايدر في الواجهة تلقائياً بناءً على كثافة النشر.</p>

                            <div className="space-y-3 overflow-y-auto max-h-[500px] custom-scrollbar pl-2">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-brand-red/20 to-brand-red/5 flex items-center justify-center font-black text-brand-red text-lg shadow-inner group-hover/item:rotate-3 transition-transform">
                                                {cat.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-black text-sm block">{cat.name}</span>
                                                <span className="text-[10px] text-blue-300/50 font-bold tracking-widest uppercase">Slug: {cat.slug}</span>
                                            </div>
                                        </div>
                                        <Badge className="bg-blue-500/10 text-blue-300 border-0 px-3 py-1 font-black text-[10px]">
                                            {cat.posts_count} مقال منشور
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {previewPost && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#001246]/60 backdrop-blur-sm z-[100]"
                            onClick={() => setPreviewPost(null)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-2 bottom-2 left-2 w-full md:w-[650px] bg-white shadow-2xl z-[110] rounded-[3rem] overflow-hidden flex flex-col border border-slate-100"
                        >
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-black text-[#001246] text-lg flex items-center gap-2">
                                    <Eye size={20} className="text-blue-500"/> معاينة التنبيه
                                </h3>
                                <button onClick={() => setPreviewPost(null)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                                <PostView post={previewPost} isPreview={true} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

TopicsSection.layout = page => <AdminLayout children={page} />;
