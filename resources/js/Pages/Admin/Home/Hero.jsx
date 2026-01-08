import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage, Link } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {
    Layout,
    RefreshCw,
    ImageIcon,
    Monitor,
    Megaphone,
    Eye, X,
    Check,
    Search,
    AlertTriangle,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";

const SelectionInput = ({
  slotName,
   placeholder,
   loadOptions,
   handleUpdateSlot,
   formatOptionLabel
  }) => (
    <div className="mt-4 relative group">
        <div className="absolute right-3 top-3 text-slate-400 z-10 pointer-events-none">
            <Search size={16} />
        </div>
        <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={(opt) => handleUpdateSlot(slotName, opt)}
            styles={{
                control: (base) => ({
                    ...base, borderRadius: "1rem",
                    paddingRight: "2rem",
                    borderColor: "#e2e8f0",
                    backgroundColor: "#f8fafc", boxShadow: "none"
                }),
                menu: (base) => ({ ...base, borderRadius: "1rem", zIndex: 100 }),
            }}
            formatOptionLabel={formatOptionLabel}
            placeholder={placeholder}
            dir="rtl"
        />
    </div>
);

export default function Hero({ heroSettings, autoSideNews = [] }) {
    const { ads = {} } = usePage().props;
    const [previewPost, setPreviewPost] = useState(null);

    const getImageUrl = (image) => image ? (image.startsWith('http') ? image : `/storage/${image}`) : '/assets/images/post.webp';

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id, label: post.title, image: getImageUrl(post.image), author: post.user?.name
            })));
    };

    const formatOptionLabel = ({ label, image, author }) => (
        <div className="flex items-center gap-3 py-2 text-right px-2">
            <img src={image} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex flex-col">
                <span className="text-xs font-black text-[#001246] line-clamp-1">{label}</span>
                <span className="text-[10px] text-gray-400">{author}</span>
            </div>
        </div>
    );

    const handleUpdateSlot = (slotName, opt) => {
        router.post(route('admin.home.hero.update'), { slot_name: slotName, post_id: opt.value }, { preserveScroll: true });
    };

    const handleResetSlot = (slotName) => {
        router.post(route('admin.home.hero.update'), { slot_name: slotName, post_id: null }, { preserveScroll: true });
    };

    const stripAds = ads['home_strip'] || [];

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة الواجهة" />
            <div className="py-8"><h1 className="text-3xl font-black text-[#001246]">واجهة الصفحة الرئيسية</h1></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black flex gap-2 items-center"><Layout /> قصة الغلاف</h2>
                            {heroSettings.main.post_id ?
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black">يدوي</span> :
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black">تلقائي</span>
                            }
                        </div>
                        <div className="relative h-[350px] rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-inner">
                            {heroSettings.main.post ? (
                                <>
                                    <img src={getImageUrl(heroSettings.main.post.image)} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001246] to-transparent" />
                                    <div className="absolute bottom-6 right-6 text-white">
                                        <h3 className="text-2xl font-black">{heroSettings.main.post.title}</h3>
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <button onClick={() => setPreviewPost(heroSettings.main.post)} className="bg-white/20 p-2
                                        rounded-xl backdrop-blur text-white hover:bg-white hover:text-black"><Eye size={18}/></button>
                                        {heroSettings.main.post_id && <button onClick={() => handleResetSlot('main')}
                                        className="bg-red-500 text-white p-2 rounded-xl"><X size={18}/></button>}
                                    </div>
                                </>
                            ) : <div className="h-full flex items-center justify-center text-slate-400">لا يوجد محتوى</div>}
                        </div>
                        <SelectionInput slotName="main" placeholder="ابحث لتغيير قصة الغلاف..." loadOptions={loadOptions}
                        handleUpdateSlot={handleUpdateSlot} formatOptionLabel={formatOptionLabel} />
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 h-full">
                        <h3 className="text-lg font-black mb-6 flex gap-2 items-center"><Monitor /> القائمة الجانبية (تلقائي)</h3>
                        <div className="space-y-4">
                            {autoSideNews.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50
                                rounded-2xl group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="font-black text-slate-300 text-xs">{i+1}</span>
                                        <p className="text-xs font-bold truncate text-[#001246]">{item.title}</p>
                                    </div>
                                    <button
                                        onClick={() => setPreviewPost(item)}
                                        className="p-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="معاينة الخبر"
                                    >
                                        <Eye size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <h3 className="text-xl font-black mb-8 flex gap-2 items-center"><Megaphone /> الشريط السفلي</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { key: 'strip_1', label: 'مقال 1', data: heroSettings.strip_1 },
                                { key: 'ad_1', label: 'إعلان 1', isAd: true, adData: stripAds[0] },
                                { key: 'strip_2', label: 'مقال 2', data: heroSettings.strip_2 },
                                { key: 'ad_2', label: 'إعلان 2', isAd: true, adData: stripAds[1] },
                            ].map((slot, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <div className={`h-40 rounded-3xl relative overflow-hidden border-2
                                      ${slot.isAd ? 'bg-purple-50 border-dashed border-purple-200' :
                                      'bg-slate-100 border-white shadow-md'}`}>
                                        {slot.isAd ? (
                                            slot.adData ? (
                                                <>
                                                    <img src={getImageUrl(slot.adData.image_url)} className="w-full h-full object-cover opacity-60" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                        <span className="text-[10px] font-black text-purple-600 bg-white/80 px-2 py-1 rounded mb-2">إعلان نشط</span>
                                                        <p className="text-[10px] font-bold line-clamp-2 text-purple-900">{slot.adData.title}</p>
                                                        <a href={slot.adData.target_link} target="_blank" className="mt-2 p-1.5 bg-purple-600 text-white rounded-full">
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-purple-300 opacity-50">
                                                    <Megaphone size={30} />
                                                    <span className="text-[10px] font-black uppercase mt-2 text-center px-4">مساحة إعلانية فارغة</span>
                                                </div>
                                            )
                                        ) : (
                                            slot.data.post ? (
                                                <>
                                                    <img src={getImageUrl(slot.data.post.image)} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0
                                                    hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setPreviewPost(slot.data.post)} className="bg-white/20 p-2
                                                        rounded-full backdrop-blur text-white"><Eye/></button>
                                                    </div>
                                                    {slot.data.post_id && <button onClick={() => handleResetSlot(slot.key)} className="absolute top-2 left-2 bg-red-500
                                                    text-white p-1 rounded-lg"><X size={14}/></button>}
                                                </>
                                            ) : <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-black uppercase">تعبئة تلقائية</div>
                                        )}
                                        <span className={`absolute top-0 right-0 text-white text-[9px] px-2 py-1 rounded-bl-xl font-black ${slot.isAd ? 'bg-purple-600' : 'bg-slate-900'}`}>{slot.label}</span>
                                    </div>
                                    {!slot.isAd && <SelectionInput slotName={slot.key} placeholder="تثبيت مقال..."
                                    loadOptions={loadOptions}
                                    handleUpdateSlot={handleUpdateSlot}
                                    formatOptionLabel={formatOptionLabel} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {previewPost && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0
                        bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setPreviewPost(null)} />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed top-0 left-0 h-full w-full
                        md:w-[600px] bg-white z-[100] shadow-2xl p-6 overflow-y-auto border-r">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-xl">معاينة المحتوى</h3>
                                <button onClick={() => setPreviewPost(null)} className="p-2 bg-slate-100 rounded-full
                                hover:bg-red-50 hover:text-red-500 transition-colors"><X/></button>
                            </div>
                            <PostView post={previewPost} isPreview={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

Hero.layout = (page) => <AdminLayout children={page} />;
