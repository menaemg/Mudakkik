import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Star, X, Eye, Plus, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";

const getImageUrl = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function TopStories({ slots }) {

    const [previewPost, setPreviewPost] = useState(null);

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                image: getImageUrl(post.image),
                slug: post.slug,
                raw: post
            })))
            .catch((error) => {
                console.error('Failed to load posts:', error);
                return [];
            });
    };

    const handleUpdate = (slotName, option) => {
        if(!option) return;
        router.post(route('admin.home.top-stories.update'), {
            slot_name: slotName, post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (slotName) => {
        router.post(route('admin.home.top-stories.update'), {
            slot_name: slotName, post_id: null
        }, { preserveScroll: true });
    };

    const EditControl = ({ slotName, hasPost, postLink, isLarge }) => (
        <div className="absolute top-2 left-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100
        transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-[calc(100%-1rem)]">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-1 border border-slate-200 flex gap-1 items-center flex-1">
                <div className="flex-1 min-w-0">
                    <AsyncSelect
                        loadOptions={loadOptions}
                        onChange={(opt) => handleUpdate(slotName, opt)}
                        placeholder={isLarge ? "اختر خبراً رئيسياً..." : "اختر خبراً..."}
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base) => ({ ...base, borderRadius: "0.5rem", fontSize:
                              '0.75rem', minHeight: '32px', border: 'none',
                              boxShadow: 'none',
                              backgroundColor: 'transparent' }),
                            menu: (base) => ({ ...base, zIndex: 999999, width: '280px' }),
                            menuPortal: base => ({ ...base, zIndex: 999999 }),
                            option: (base, state) => ({ ...base,
                              backgroundColor: state.isFocused ?
                              "#f1f5f9" : "white", color: "#0f172a", fontSize: "0.8rem", cursor: "pointer" })
                        }}
                        formatOptionLabel={({ label, image }) => (
                            <div className="flex items-center gap-2">
                                <img src={image} className="w-5 h-5
                                rounded-md object-cover border border-slate-100"/>
                                <span className="text-xs font-bold truncate">{label}</span>
                            </div>
                        )}
                        dir="rtl"
                    />
                </div>
            </div>

            <div className="flex gap-1">
                {hasPost && (
                    <>
                        <button
                            onClick={() => {
                                const post = slots.find(s => s.slot_name === slotName)?.post;
                                setPreviewPost(post);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg
                            border border-blue-200 shadow-sm flex items-center justify-center h-[42px] w-[42px]"
                            title="معاينة"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => handleReset(slotName)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2
                            rounded-lg border border-red-200 shadow-sm flex items-center justify-center h-[42px] w-[42px]"
                            title="إزالة"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    const StoryCard = ({ slot }) => {
        const { post, is_large, slot_name, is_manual } = slot;

        return (
            <div className={`relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300
                ${is_large ? 'md:col-span-2 h-[350px] lg:h-[450px]' : 'md:col-span-1 h-[300px] lg:h-[450px]'}
                ${post ? 'border-0' : 'border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/10'}`}
            >
                <EditControl slotName={slot_name} hasPost={!!post} isLarge={is_large} />

                {post ? (
                    <>
                        <img
                            src={getImageUrl(post.image)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000a2e] via-[#000a2e]/40 to-transparent opacity-90"></div>

                        <div className="absolute bottom-0 right-0 p-6 w-full z-10 flex flex-col justify-end h-full pointer-events-none">
                            <div className="mb-auto">
                                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md">
                                    {post.category?.name || 'عام'}
                                </span>
                            </div>

                            <h3 className={`font-black text-white leading-tight mb-2 drop-shadow-lg
                                ${is_large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                                {post.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mt-2 pt-3 border-t border-white/10">
                                <img
                                    src={getImageUrl(post.user?.avatar)}
                                    className="w-5 h-5 rounded-full border border-white/30"
                                />
                                <span>{post.user?.name}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-500 mx-1"></span>
                                <span>{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                        </div>

                        {is_manual && (
                            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                                <Badge className="bg-amber-500 hover:bg-amber-600 border-0 text-white shadow-lg text-[10px]">
                                    مثبت يدوياً
                                </Badge>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 p-4 text-center">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center
                        group-hover:scale-110 transition-transform">
                            <Plus size={28} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-500 text-sm">
                                {is_large ? 'مكان قصة رئيسية (كبير)' : 'مكان قصة فرعية (صغير)'}
                            </p>
                            <p className="text-[10px] opacity-70 mt-1">
                                سيتم ملؤه تلقائياً بالأكثر قراءة إذا ترك فارغاً
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة أهم قصص اليوم" />

            <div className="py-8 mb-8 border-b border-slate-200/60">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <Zap className="text-yellow-500 fill-yellow-500" size={32} /> أهم قصص اليوم (Top Stories)
                </h1>
                <p className="text-slate-500 font-bold mt-2 text-sm">
                    تحكم في القسم الأبرز بالموقع. الأخبار المثبتة هنا تظهر أولاً، والباقي يُملأ تلقائياً بالأكثر قراءة.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {slots.map((slot) => (
                    <StoryCard key={slot.slot_name} slot={slot} />
                ))}
            </div>

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
                            className="fixed top-2 bottom-2 left-2 w-full md:w-[600px] bg-white shadow-2xl z-[110] rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-100"
                        >
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-black text-[#001246] text-lg flex items-center gap-2">
                                    <Eye size={18} className="text-blue-500"/> معاينة سريعة
                                </h3>
                                <button onClick={() => setPreviewPost(null)} className="w-8 h-8 flex
                                items-center justify-center
                                bg-slate-50 hover:bg-red-50
                                hover:text-red-500 rounded-full transition-colors">
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

TopStories.layout = page => <AdminLayout children={page} />;
