import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, X, Eye, Plus, Trash2, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"; // 1. استيراد الانيميشن
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView"; // 2. استيراد عارض المقال

const getImagePath = (path) => {
    if (!path) return '/assets/images/placeholder.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function Featured({ featuredData }) {

    const [previewPost, setPreviewPost] = useState(null);

    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                image: getImagePath(post.image),
                slug: post.slug,
                raw: post
            })));
    };

    const handleUpdate = (section, slotName, option) => {
        if(!option) return;
        router.post(route('admin.home.featured.update'), {
            section: section, slot_name: slotName, post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (section, slotName) => {
        router.post(route('admin.home.featured.update'), {
            section: section, slot_name: slotName, post_id: null
        }, { preserveScroll: true });
    };

    const EditControl = ({ section, slotName, hasPost, onView }) => (
        <div className="absolute top-2 left-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-[calc(100%-1rem)] max-w-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-1 border border-slate-200 flex gap-1 items-center flex-1">
                <div className="flex-1 min-w-0">
                    <AsyncSelect
                        loadOptions={loadOptions}
                        onChange={(opt) => handleUpdate(section, slotName, opt)}
                        placeholder="اختر خبراً..."
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: "0.5rem",
                                fontSize: '0.75rem',
                                minHeight: '32px',
                                border: 'none',
                                boxShadow: 'none',
                                backgroundColor: 'transparent'
                            }),
                            menu: (base) => ({ ...base, zIndex: 999999, width: '300px' }),
                            menuPortal: base => ({ ...base, zIndex: 999999 }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? "#f1f5f9" : "white",
                                color: "#0f172a",
                                fontSize: "0.8rem",
                                cursor: "pointer"
                            })
                        }}
                        formatOptionLabel={({ label, image }) => (
                            <div className="flex items-center gap-2">
                                <img src={image} className="w-5 h-5 rounded-md object-cover border border-slate-100"/>
                                <span className="text-xs font-bold truncate">{label}</span>
                            </div>
                        )}
                        dir="rtl"
                    />
                </div>
            </div>

            <div className="flex gap-1">
\                {hasPost && onView && (
                    <button
                        onClick={onView}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg border border-blue-200 shadow-sm transition-colors flex items-center justify-center h-[42px] w-[42px]"
                        title="معاينة سريعة"
                        type="button"
                    >
                        <Eye size={18} />
                    </button>
                )}

                {hasPost && (
                    <button
                        onClick={() => handleReset(section, slotName)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-200 shadow-sm transition-colors flex items-center justify-center h-[42px] w-[42px]"
                        title="إزالة الخبر"
                        type="button"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        </div>
    );

    const SectionHeader = ({ title, colorClass = "bg-brand-red" }) => (
        <div className="flex items-end justify-between border-b border-gray-200 pb-3 mb-8">
            <h2 className="text-2xl font-black text-[#001246] relative pl-4">
                {title}
                <span className={`absolute -bottom-[13px] right-0 w-[40px] h-[4px] ${colorClass} rounded-t-sm`}></span>
            </h2>
        </div>
    );

    const MainCard = ({ data }) => {
        const post = data?.post;
        return (
            <div className="group relative mb-10">
                <EditControl
                    section="featured"
                    slotName="main"
                    hasPost={!!post}
                    onView={() => setPreviewPost(post)}
                />

                {post ? (
                    <div className="relative h-[450px] md:h-[520px] w-full overflow-hidden mb-5 rounded-2xl shadow-xl border border-slate-100 bg-slate-900">
                        <img src={getImagePath(post.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                        <div className="absolute top-5 right-5 z-20">
                            <Badge className="bg-[#D00000] text-white border-0 px-4 py-1.5 text-xs font-bold uppercase shadow-lg">قصة الغلاف</Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 right-0 p-6 md:p-10 w-full z-10">
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg line-clamp-2">{post.title}</h2>
                            <div className="flex items-center gap-3 text-white/90 text-sm font-bold border-t border-white/20 pt-4 w-fit">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8 border-2 border-white/30">
                                        <AvatarImage src={getImagePath(post.user?.avatar)} />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <span className="shadow-black drop-shadow-md">{post.user?.name}</span>
                                </div>
                                <span className="text-white/50">•</span>
                                <span>{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[450px] w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:border-[#D00000] group-hover:bg-red-50/10 transition-all gap-4">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                            <Plus size={32} className="text-slate-300 group-hover:text-[#D00000] transition-colors" />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-lg text-slate-500">مساحة فارغة</span>
                            <span className="text-xs">اضغط لاختيار قصة الغلاف</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const SubCard = ({ data, colorClass }) => {
        const post = data?.post;
        return (
            <div className="group relative">
                <EditControl
                    section="featured"
                    slotName={data.slot_name}
                    hasPost={!!post}
                    onView={() => setPreviewPost(post)}
                />

                {post ? (
                    <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 bg-white shadow-sm h-full">
                        <div className="w-[110px] h-[85px] shrink-0 overflow-hidden rounded-lg shadow-sm relative bg-slate-200">
                            <img src={getImagePath(post.image)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className={`absolute bottom-0 w-full h-1 ${colorClass.replace('text-', 'bg-')}`}></div>
                        </div>
                        <div className="flex flex-col pt-1 flex-1">
                            <span className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${colorClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')}`}></span>
                                {post.category?.name || 'عام'}
                            </span>
                            <h3 className="font-bold text-[14px] leading-snug text-[#001246] line-clamp-2">{post.title}</h3>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 h-[110px] justify-center text-slate-400 font-bold text-xs cursor-pointer group-hover:border-blue-200 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                            <Plus size={20} />
                            <span>إضافة خبر فرعي</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

          const EditorCard = ({ data, index }) => {
        const post = data?.post;
        return (
            <div className="relative group">
                <EditControl
                    section="editors_choice"
                    slotName={data.slot_name}
                    hasPost={!!post}
                    onView={() => setPreviewPost(post)}
                />

                {post ? (
                    <div className="flex gap-5 items-start py-4 border-b border-gray-100 hover:bg-white hover:px-4 rounded-xl transition-all">
                        <div className="relative">
                            <span className="text-4xl font-black text-slate-200 group-hover:text-[#D00000]/20 transition-colors">0{index + 1}</span>
                            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#D00000] group-hover:h-full transition-all duration-300 rounded-full"></div>
                        </div>
                        <div className="flex-1 flex flex-col z-10">
                            <Badge variant="outline" className="w-fit mb-2 text-[10px] border-slate-200 text-slate-500 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                                {post.category?.name}
                            </Badge>
                            <h3 className="font-bold text-[15px] leading-snug text-[#001246] group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                <span>بواسطة</span>
                                <span className="text-gray-600 font-bold underline decoration-gray-200 underline-offset-2">{post.user?.name}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 border-dashed bg-slate-50/30 px-4 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-50 h-[80px] group-hover:border-blue-200 transition-colors">
                        <span className="flex items-center gap-2"><Plus size={16} /> إضافة اختيار #{index + 1}</span>
                        <span className="text-slate-200 text-3xl font-black">0{index+1}</span>
                    </div>
                )}
            </div>
        );
    };

    const subColors = ["text-orange-600", "text-green-600", "text-blue-600", "text-purple-600"];

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة الأخبار المميزة" />

            <div className="py-8 mb-8 border-b border-slate-200/60">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <Star className="text-[#D00000]" size={32} /> إدارة الأخبار المميزة
                </h1>
                <p className="text-slate-500 font-bold mt-2 text-sm">تحكم كامل في الأخبار التي تظهر في الواجهة (Main, Sub, Editor Choice).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                <div className="lg:col-span-8 flex flex-col">
                    <SectionHeader title="أخبار مميزة" colorClass="bg-[#D00000]" />
                    <MainCard data={featuredData.main} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                        {(featuredData.subs || []).map((item, i) => (
                            <SubCard key={i} data={item} colorClass={subColors[i % subColors.length]} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col lg:pl-8 lg:border-r lg:border-gray-200/60 h-full">
                    <SectionHeader title="اختيارات المحرر" colorClass="bg-blue-600" />
                    <div className="flex flex-col gap-2">
                        {(featuredData.editors || []).map((item, i) => (
                            <EditorCard key={i} data={item} index={i} />
                        ))}
                    </div>
                    <div className="mt-12 border-2 border-dashed border-slate-200 rounded-2xl h-48 flex items-center justify-center text-slate-300 font-bold flex-col gap-2 group hover:border-blue-200 transition-colors cursor-not-allowed">
                        <LayoutTemplate size={32} className="opacity-50"/>
                        <span>مساحة إعلانية</span>
                        <span className="text-[10px] opacity-70">يتم إدارتها من قسم الإعلانات</span>
                    </div>
                </div>
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
                                <button onClick={() => setPreviewPost(null)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                               <PostView post={previewPost} onBack={() => setPreviewPost(null)} isPreview={true} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

Featured.layout = page => <AdminLayout children={page} />;
