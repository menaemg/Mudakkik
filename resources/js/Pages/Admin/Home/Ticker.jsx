import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { ScrollText, X, Check, Search, AlertTriangle } from "lucide-react";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";
import { motion, AnimatePresence } from "framer-motion";

export default function Ticker({ tickerSlots }) {
    const [processing, setProcessing] = useState(false);
    const [previewPost, setPreviewPost] = useState(null);

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                raw: post
            })));
    };

    const handleUpdate = (slotName, selectedOption) => {
        if (!selectedOption) return;
        setProcessing(true);
        router.post(route('admin.home.ticker.update'), {
            slot_name: slotName, post_id: selectedOption.value
        }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleReset = (slotName) => {
        setProcessing(true);
        router.post(route('admin.home.ticker.update'), {
            slot_name: slotName, post_id: null
        }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
            preserveState: true
        });
    };

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة شريط الأخبار" />

            <div className="py-8">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <ScrollText className="text-[#D00000]" size={32}/> إدارة شريط الأخبار (Ticker)
                </h1>
                <p className="text-slate-500 font-bold mt-2">ثبت أخباراً عاجلة في الشريط العلوي.</p>
            </div>

            <div className="mb-10 sticky top-4 z-40">
                <div className="bg-[#b20e1e] text-white p-3 rounded-xl shadow-xl flex items-center gap-4 overflow-hidden border-2 border-[#8a0008]">
                    <div className="bg-white text-[#b20e1e] text-xs font-black px-3 py-1 rounded shadow-sm shrink-0 animate-pulse">
                        عاجل
                    </div>
                    <div className="flex-1 overflow-hidden whitespace-nowrap relative h-6">
                        <div className="absolute top-0 right-0 w-full animate-marquee flex gap-8 items-center">
                            {tickerSlots.map((slot, i) => (
                                <span key={i} className="text-sm font-bold opacity-90 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                    {slot.post?.title || "..."}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 max-w-4xl mx-auto">
                {tickerSlots.map((slot, index) => (
                    <div
                        key={slot.slot}
                        className={`p-4 rounded-2xl border-2 transition-all ${slot.type === 'manual' ? 'bg-white border-[#001246] shadow-md' : 'bg-slate-50 border-slate-200 border-dashed'}`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div className="flex items-center gap-4 min-w-[150px]">
                                <span className="bg-slate-200 text-slate-600 w-8 h-8 flex
                                items-center justify-center rounded-full font-black">
                                    {index + 1}
                                </span>
                                {slot.type === 'manual' ? (
                                    <span className="text-[10px] bg-amber-100 text-amber-700
                                    px-2 py-1 rounded-lg font-bold border border-amber-200 flex items-center gap-1">
                                        <Check size={12}/> مثبت يدوياً
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1
                                    rounded-lg font-bold border border-blue-200 flex items-center gap-1">
                                        <Search size={12}/> تلقائي
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                {slot.post ? (
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setPreviewPost(slot.post)} className="font-bold
                                        text-[#001246] hover:text-blue-600 transition-colors
                                        text-sm line-clamp-1 text-right flex-1">
                                            {slot.post.title}
                                        </button>
                                        <span className="text-[10px] text-slate-400 shrink-0">{new Date(slot.post.created_at).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                ) : (
                                    <div className="text-slate-400 text-sm flex items-center gap-2">
                                        <AlertTriangle size={16}/> لا يوجد أخبار متاحة للعرض
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 min-w-[250px]">
                                <div className="flex-1">
                                    <AsyncSelect
                                        cacheOptions defaultOptions loadOptions={loadOptions}
                                        onChange={(opt) => handleUpdate(slot.slot, opt)}
                                        placeholder="ابحث لتثبيت خبر..."
                                        styles={{
                                            control: (base) => ({ ...base, borderRadius: "0.5rem", fontSize: '0.8rem', minHeight: '38px', borderColor: '#e2e8f0' }),
                                            menu: (base) => ({ ...base, zIndex: 9999 }),
                                            input: (base) => ({...base, 'input:focus': { boxShadow: 'none' }})
                                        }}
                                        dir="rtl"
                                    />
                                </div>
                                {slot.type === 'manual' && (
                                    <button
                                        onClick={() => handleReset(slot.slot)}
                                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2
                                        rounded-lg transition-colors border border-red-200"
                                        title="إلغاء التثبيت"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {previewPost && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[90]" onClick={() => setPreviewPost(null)} />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed top-0 left-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[100] flex flex-col">
                            <div className="p-4 border-b flex justify-between bg-white">
                                <h3 className="font-bold">معاينة الخبر</h3>
                                <button onClick={() => setPreviewPost(null)}><X /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                               <PostView post={previewPost} onBack={() => setPreviewPost(null)} isPreview={true} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

Ticker.layout = (page) => <AdminLayout children={page} />;
