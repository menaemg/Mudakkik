import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Eye, Trash2, Plus, DollarSign, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";

const getImageUrl = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function Business({ slots }) {
    const [previewPost, setPreviewPost] = useState(null);

    useEffect(() => {
        import('aos').then((AOS) => {
            AOS.init({ duration: 800, once: true });
        });
    }, []);

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                image: getImageUrl(post.image),
                slug: post.slug,
                raw: post
            })));
    };

    const handleUpdate = (slotName, option) => {
        if (!option) return;
        router.post(route('admin.home.business.update'), {
            slot_name: slotName, post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (slotName) => {
        router.post(route('admin.home.business.update'), {
            slot_name: slotName, post_id: null
        }, { preserveScroll: true });
    };

    const EditControl = ({ slotName, hasPost }) => (
        <div className="absolute top-2 left-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-all
        duration-200 translate-y-2 group-hover:translate-y-0 w-[calc(100%-1rem)]">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg
            shadow-2xl p-1 border border-slate-200
            flex gap-1 items-center flex-1">
                <div className="flex-1 min-w-0">
                    <AsyncSelect
                        loadOptions={loadOptions}
                        onChange={(opt) => handleUpdate(slotName, opt)}
                        placeholder="اختر خبراً..."
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base) => ({ ...base, borderRadius: "0.5rem",
                              fontSize: '0.75rem', minHeight: '32px',
                              border: 'none', boxShadow: 'none',
                              backgroundColor: 'transparent' }),
                            menu: (base) => ({ ...base, zIndex: 999999, width: '280px' }),
                            option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "#f1f5f9" : "white", color: "#0f172a", fontSize: "0.8rem", cursor: "pointer" })
                        }}
                        formatOptionLabel={({ label, image }) => (
                            <div className="flex items-center gap-2">
                                <img src={image} className="w-5 h-5 rounded-md object-cover border border-slate-100" />
                                <span className="text-xs font-bold truncate">{label}</span>
                            </div>
                        )}
                        dir="rtl"
                    />
                </div>
            </div>
            {hasPost && (
                <div className="flex gap-1">
                    <button
                        onClick={() => { const post = slots.find(s => s.slot_name === slotName)?.post; setPreviewPost(post); }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2
                        rounded-lg border border-blue-200 shadow-sm flex items-center justify-center h-[42px] w-[42px]"
                        title="معاينة الخبر"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => handleReset(slotName)}
                        className="bg-red-50 hover:bg-red-100 text-red-600
                        p-2 rounded-lg border border-red-200 shadow-sm
                        flex items-center justify-center h-[42px] w-[42px]"
                        title="إزالة التثبيت"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );

    const BusinessCard = ({ slot }) => {
        const { post, slot_name } = slot;

        return (
            <div className={`group relative bg-white rounded-xl
              overflow-hidden shadow-sm transition-all
              duration-300 border h-full flex flex-col
                ${post ? 'hover:shadow-xl border-gray-100' : 'border-dashed border-slate-300 bg-slate-50'}`}>

                <EditControl slotName={slot_name} hasPost={!!post} />

                {post ? (
                    <>
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={getImageUrl(post.image)}
                                className="w-full h-full object-cover
                                transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px]
                            font-bold px-2 py-1 rounded-md shadow-sm text-gray-800">
                                {new Date(post.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs
                            text-blue-800 font-bold mb-2 uppercase tracking-wide">
                                <Briefcase size={12} />
                                <span>{post.category?.name || 'اقتصاد وأعمال'}</span>
                            </div>
                            <h3 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-3">
                                {post.title}
                            </h3>
                        </div>
                        <div className="absolute top-3 left-3 z-20">
                            <Badge className="bg-amber-500 hover:bg-amber-600
                            text-white shadow-lg text-[10px] border-0">
                                مثبت يدوياً
                            </Badge>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 gap-3 min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center
                        justify-center group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-slate-400" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-bold block text-slate-500">خانة فارغة</span>
                            <span className="text-[10px] opacity-70">اختر خبراً لتثبيته هنا</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة قسم مال وأعمال" />

            <div className="py-8 mb-8 border-b border-slate-200/60">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <DollarSign className="text-blue-600" size={32} /> إدارة مال وأعمال
                </h1>
                <p className="text-slate-500 font-bold mt-2 text-sm">
                    تحكم في الأخبار المثبتة في قسم الاقتصاد. الخانات الفارغة ستعرض محتوى تلقائياً في واجهة المستخدم، أو يمكنك تثبيت أخبار محددة هنا.
                </p>
            </div>

            <section className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {slots.map((slot) => (
                        <BusinessCard key={slot.slot_name} slot={slot} />
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {previewPost && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#001246]/40 backdrop-blur-sm z-[100]"
                            onClick={() => setPreviewPost(null)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-2 bottom-2 left-2 w-full md:w-[600px] bg-white shadow-2xl z-[110]
                            rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-100"
                        >
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-black text-[#001246] text-lg flex items-center gap-2">
                                    <Eye size={18} className="text-blue-500" /> معاينة سريعة
                                </h3>
                                <button onClick={() => setPreviewPost(null)} className="w-8 h-8 flex items-center justify-center
                                bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                                <PostView post={previewPost} onBack={() => setPreviewPost(null)} isPreview={true} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

Business.layout = page => <AdminLayout children={page} />;
