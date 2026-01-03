import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {
    Layout, RefreshCw,
    Image as ImageIcon, Monitor, Flame, Megaphone, Eye, X, Check, Search, AlertTriangle
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";

export default function Hero({ heroSettings, autoSideNews = [], trendingStats = [] }) {
    const main = heroSettings?.main || {};
    const strip1 = heroSettings?.strip_1 || {};
    const strip2 = heroSettings?.strip_2 || {};

    const [processing, setProcessing] = useState(false);
    const [previewPost, setPreviewPost] = useState(null);

    const getImageUrl = (image) => image ? (image.startsWith('http') ? image : `/storage/${image}`) : '/assets/images/placeholder.webp';

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        // بنبعت الطلب ونستقبل النتيجة
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => {
                return res.data.map(post => ({
                    value: post.id,
                    label: post.title,
                    image: getImageUrl(post.image),
                    author: post.user?.name,
                    raw: post
                }));
            });
    };

    const formatOptionLabel = ({ label, image, author }) => (
        <div className="flex items-center gap-3 py-2 text-right border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors">
            <img src={image} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-sm" />
            <div className="flex flex-col">
                <span className="text-xs font-black text-[#001246] line-clamp-1">{label}</span>
                <span className="text-[10px] text-gray-400 font-medium">{author}</span>
            </div>
        </div>
    );


    const handleUpdateSlot = (slotName, selectedOption) => {
            if (!selectedOption) return;
            setProcessing(true);
            router.post(route('admin.home.hero.update'), {
                slot_name: slotName, post_id: selectedOption.value
            }, { onFinish: () => setProcessing(false), preserveScroll: true });
        };

        const handleResetSlot = (slotName) => {
            setProcessing(true);
            router.post(route('admin.home.hero.update'), {
                slot_name: slotName, post_id: null
            }, { onFinish: () => setProcessing(false), preserveScroll: true });
        };

    const SelectionInput = ({ slotName, placeholder }) => (
        <div className="mt-4 relative group">
            <div className="absolute right-3 top-3 text-slate-400 z-10 pointer-events-none group-focus-within:text-[#D00000] transition-colors">
                <Search size={16} />
            </div>
            <AsyncSelect
                cacheOptions defaultOptions loadOptions={loadOptions}
                onChange={(opt) => handleUpdateSlot(slotName, opt)}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        borderRadius: "1rem",
                        paddingRight: "2rem",
                        paddingTop: "0.2rem",
                        paddingBottom: "0.2rem",
                        borderColor: state.isFocused ? "#001246" : "#e2e8f0",
                        backgroundColor: "#f8fafc",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#cbd5e1" }
                    }),
                    menu: (base) => ({ ...base, borderRadius: "1rem", zIndex: 100, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }),
                    input: (base) => ({ ...base, color: '#001246', fontWeight: 'bold', fontSize: '0.85rem' }),
                    placeholder: (base) => ({ ...base, fontSize: '0.8rem', color: '#94a3b8' }),
                }}
                formatOptionLabel={formatOptionLabel}
                placeholder={placeholder}
                noOptionsMessage={() => "لا توجد نتائج مطابقة"}
                loadingMessage={() => "جاري البحث..."}
                dir="rtl"
            />
        </div>
    );

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة الواجهة" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
                <div>
                    <h1 className="text-3xl font-black text-[#001246] tracking-tight">واجهة الصفحة الرئيسية</h1>
                    <p className="text-slate-500 font-bold text-sm mt-2 flex items-center gap-2">
                        <Monitor size={14} /> التحكم في المحتوى المعروض (Live Preview)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8">
                    <div className="bg-white p-1 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
                        <div className="bg-slate-50/50 p-6 rounded-[2.3rem] border border-slate-100">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <h2 className="text-lg font-black text-[#001246] flex gap-2 items-center">
                                    <span className="p-2 bg-red-50 text-[#D00000] rounded-xl"><Layout size={18} /></span>
                                    قصة الغلاف
                                </h2>
                                {main.post_id ?
                                    <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-black border border-amber-200"><Check size={12}/> مثبت يدوياً</span> :
                                    <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-black border border-blue-200"><RefreshCw size={12}/> تلقائي</span>
                                }
                            </div>

                            <div className="relative h-[320px] rounded-[2rem] overflow-hidden group shadow-md border-4 border-white transition-all hover:shadow-lg">
                                {main.post ? (
                                    <>
                                        <img src={getImageUrl(main.post.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#001246]/90 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-0 right-0 p-8 w-full">
                                            <span className="bg-[#D00000] text-white text-[10px] px-2 py-1 rounded-lg font-black mb-2 inline-block shadow-sm">
                                                {main.post.category?.name || 'عام'}
                                            </span>
                                            <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">{main.post.title}</h3>
                                            <div className="flex items-center gap-3 text-white/80 text-xs font-bold">
                                                <span><ImageIcon size={12} className="inline ml-1"/> {main.post.user?.name}</span>
                                                <span><Eye size={12} className="inline ml-1"/> {main.post.views}</span>
                                            </div>
                                        </div>

                                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                                            <button onClick={() => setPreviewPost(main.post)} className="bg-white/20 backdrop-blur hover:bg-white text-white hover:text-[#001246] p-2.5 rounded-xl transition-all shadow-lg border border-white/10" title="معاينة">
                                                <Eye size={18} />
                                            </button>
                                            {main.post_id && (
                                                <button onClick={() => handleResetSlot('main')} className="bg-red-500/90 hover:bg-[#D00000] text-white p-2.5 rounded-xl transition-all shadow-lg backdrop-blur flex items-center gap-2 text-xs font-bold border border-white/10">
                                                    <X size={14} /> إلغاء
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : <div className="h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 font-bold gap-2"><AlertTriangle/> لا يوجد مقال</div>}
                            </div>
                            <SelectionInput slotName="main" placeholder="ابحث لتغيير قصة الغلاف..." />
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col">
                        <h3 className="text-lg font-black text-[#001246] mb-6 flex gap-2 items-center">
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Monitor size={18} /></span>
                            القائمة الجانبية
                        </h3>
                        <div className="flex-1 space-y-4">
                            {autoSideNews.map((item, i) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all rounded-2xl group items-center cursor-default">
                                    <span className="font-black text-slate-300 w-6 text-center text-lg italic group-hover:text-[#D00000] transition-colors">{i+1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#001246] truncate leading-relaxed">{item.title}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{new Date(item.created_at).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                    <button onClick={() => setPreviewPost(item)} className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Eye size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Auto-Fill: Latest News</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                             <h3 className="text-xl font-black text-[#001246] flex gap-2 items-center">
                                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Megaphone size={20} /></span>
                                الشريط السفلي
                             </h3>
                             <div className="flex gap-2">
                                 <span className="text-[10px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl font-bold border border-slate-100">Post</span>
                                 <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1.5 rounded-xl font-bold border border-purple-100">Ad</span>
                                 <span className="text-[10px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl font-bold border border-slate-100">Post</span>
                                 <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1.5 rounded-xl font-bold border border-purple-100">Ad</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { data: strip1, name: 'strip_1', type: 'post', label: 'مقال 1' },
                                { data: null, name: 'ad_1', type: 'ad', label: 'مساحة إعلانية 1' },
                                { data: strip2, name: 'strip_2', type: 'post', label: 'مقال 2' },
                                { data: null, name: 'ad_2', type: 'ad', label: 'مساحة إعلانية 2' }
                            ].map((slot, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <div className={`h-36 rounded-3xl relative overflow-hidden group border-2 transition-all ${slot.type === 'ad' ? 'bg-purple-50 border-dashed border-purple-200' : 'bg-slate-100 border-white shadow-md'}`}>

                                        {slot.type === 'post' ? (
                                            slot.data?.post ? (
                                                <>
                                                    <img src={getImageUrl(slot.data.post.image)} className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => setPreviewPost(slot.data.post)} className="text-white bg-white/20 p-3 rounded-full backdrop-blur hover:bg-[#001246] transition shadow-xl border border-white/20"><Eye size={20}/></button>
                                                    </div>
                                                    {slot.data.post_id && (
                                                        <button onClick={() => handleResetSlot(slot.name)} className="absolute top-3 left-3 bg-red-500/90 text-white p-1.5 rounded-lg text-[10px] z-20 shadow-md backdrop-blur border border-white/20 hover:scale-105 transition"><X size={14}/></button>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-white text-xs font-bold line-clamp-1">{slot.data.post.title}</p>
                                                    </div>
                                                </>
                                            ) : <div className="h-full flex items-center justify-center text-xs text-slate-400 font-bold">Auto Random</div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-purple-300">
                                                <Megaphone size={24} className="mb-2 opacity-50" />
                                                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">Ad Slot #{idx === 1 ? 1 : 2}</span>
                                            </div>
                                        )}

                                        <span className={`absolute top-0 right-0 text-white text-[10px] px-3 py-1 rounded-bl-2xl font-black shadow-sm ${slot.type === 'post' ? 'bg-[#001246]' : 'bg-purple-400'}`}>
                                            {slot.label}
                                        </span>
                                    </div>

                                    {slot.type === 'post' && (
                                        <SelectionInput slotName={slot.name} placeholder={`تثبيت ${slot.label}...`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {previewPost && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#001246]/40 backdrop-blur-sm z-[90]"
                            onClick={() => setPreviewPost(null)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-2 bottom-2 left-2 w-full md:w-[500px] bg-white shadow-2xl z-[100] rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-100"
                        >
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-black text-[#001246] text-lg flex items-center gap-2"><Eye size={18} className="text-blue-500"/> معاينة سريعة</h3>
                                <button onClick={() => setPreviewPost(null)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={18} /></button>
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

Hero.layout = (page) => <AdminLayout children={page} />;
