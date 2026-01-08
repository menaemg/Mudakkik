import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Settings2, X, Eye, Plus, Trash2, Video, Music, Calendar, Lock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import PostView from "@/Pages/Admin/Components/Posts/Partials/PostView";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const getImageUrl = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};
export default function Entertainment({ slots, agendaAd }) {
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
            })))
            .catch((error) => {
                console.error('Failed to load posts:', error);
                return [];
            });
    };

    const handleUpdate = (slotName, option) => {
        if (!option) return;
        router.post(route('admin.home.entertainment.update'), {
            slot_name: slotName, post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (slotName) => {
        router.post(route('admin.home.entertainment.update'), {
            slot_name: slotName, post_id: null
        }, { preserveScroll: true });
    };

    const EditControl = ({ slotName, hasPost }) => (
        <div className="absolute top-2 left-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100
        transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-[calc(100%-1rem)]">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-1
            border border-slate-200 flex gap-1 items-center flex-1">
                <div className="flex-1 min-w-0">
                    <AsyncSelect
                        loadOptions={loadOptions}
                        onChange={(opt) => handleUpdate(slotName, opt)}
                        placeholder="بحث عن خبر..."
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base) => ({ ...base, borderRadius: "0.5rem", fontSize: '0.75rem', minHeight: '32px', border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }),
                            menu: (base) => ({ ...base, zIndex: 999999, width: '280px' }),
                            menuPortal: base => ({ ...base, zIndex: 999999 }),
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
                        onClick={() => {
                            const post = slots.find(s => s.slot_name === slotName)?.post;
                            setPreviewPost(post);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg border border-blue-200 shadow-sm flex items-center justify-center h-[42px] w-[42px]"
                        title="معاينة"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => handleReset(slotName)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-200 shadow-sm flex items-center justify-center h-[42px] w-[42px]"
                        title="إزالة"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );

    const RenderSlot = ({ name }) => {
        if (name === 'agenda') {
            return (
                <div className="h-[200px] bg-gradient-to-br from-pink-600 to-rose-700 mb-6 flex
                flex-col items-center justify-center text-white text-center p-6 rounded-xl shadow-xl
                relative overflow-hidden group border border-pink-500/30">

                    <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge className="bg-black/50 hover:bg-black/70 text-white text-[10px] gap-1 backdrop-blur-md border-0 px-2 py-1">
                            <Lock size={10} /> مساحة إعلانية
                        </Badge>
                    </div>

                    {agendaAd ? (
                        <>
                            {agendaAd.image && (
                                <img
                                    src={getImageUrl(agendaAd.image)}
                                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                                    alt="Ad Background"
                                />
                            )}

                            <div className="relative z-10 w-full pointer-events-none">
                                <h4 className="text-xl font-black mb-2 drop-shadow-md line-clamp-1">
                                    {agendaAd.title}
                                </h4>
                                <p className="text-[10px] text-white/90 mb-4 line-clamp-1 font-medium">
                                    {agendaAd.description || 'عرض خاص'}
                                </p>
                                <div className="inline-flex items-center gap-1 bg-white text-rose-600 px-4 py-1.5 text-[10px] font-bold rounded-full shadow-sm">
                                    <span>اضغط هنا</span>
                                    <ExternalLink size={10} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="relative z-10 opacity-60">
                            <Calendar className="mx-auto mb-2" size={24} />
                            <h4 className="text-lg font-bold mb-1">أجندة الفعاليات</h4>
                            <p className="text-[10px]">مساحة إعلانية (فارغة حالياً)</p>
                        </div>
                    )}
                </div>
            );
        }

        const slotData = slots.find(s => s.slot_name === name) || { slot_name: name, type: 'unknown' };
        const { post, is_manual, type } = slotData;

        if (type === 'main') {
            return (
                <div className="relative h-[600px] w-full overflow-hidden rounded-xl shadow-2xl block group bg-slate-100 border border-slate-200">
                    <EditControl slotName={name} hasPost={!!post} />
                    {post ? (
                        <>
                            <img src={getImageUrl(post.image)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 right-8 left-8 bg-[#b20e1e]/90 backdrop-blur-md p-6 text-white shadow-xl border-t-4 border-white/20 rounded-sm">
                                <span className="text-[10px] font-black uppercase mb-3 block text-white/80 tracking-widest">
                                    ★ {post.category?.name}
                                </span>
                                <h2 className="text-3xl font-black leading-tight mb-4 drop-shadow-md">{post.title}</h2>
                                <div className="flex items-center gap-2 text-xs text-white/90">
                                    <Avatar className="w-6 h-6 border border-white/30"><AvatarImage src={getImageUrl(post.user?.avatar)} /></Avatar>
                                    <span>{post.user?.name}</span>
                                </div>
                            </div>
                        </>
                    ) : <EmptyState label="الخبر الرئيسي" />}
                    {is_manual && <ManualBadge />}
                </div>
            );
        }

        if (type === 'vertical') {
            return (
                <div className="flex flex-col group bg-white p-3 rounded-xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 relative min-h-[300px]">
                    <EditControl slotName={name} hasPost={!!post} />
                    {post ? (
                        <>
                            <div className="h-48 overflow-hidden rounded-lg mb-3 relative shadow-sm">
                                <img src={getImageUrl(post.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#b20e1e] mb-2 font-black">
                                <span>{post.category?.name}</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-400">{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <h3 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-[#b20e1e] transition-colors line-clamp-2">{post.title}</h3>
                        </>
                    ) : <EmptyState label="خبر عمودي" />}
                    {is_manual && <ManualBadge />}
                </div>
            );
        }

        if (type === 'side') {
            return (
                <div className="mb-4 border-b border-gray-100 pb-4 last:border-0 last:mb-0 last:pb-0 group relative min-h-[80px]">
                    <EditControl slotName={name} hasPost={!!post} />
                    {post ? (
                        <div className="block text-right">
                            <span className="text-[10px] text-[#b20e1e] font-bold block mb-1 uppercase">{post.category?.name}</span>
                            <h4 className="font-bold text-[14px] leading-snug text-gray-900 mb-2">{post.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Avatar className="w-4 h-4"><AvatarImage src={getImageUrl(post.user?.avatar)} /></Avatar>
                                <span>{post.user?.name}</span>
                            </div>
                        </div>
                    ) : <div className="text-center text-xs text-gray-300 py-4">فارغ</div>}

                    {is_manual && <div className="absolute top-0 left-0 w-2 h-2 bg-amber-500 rounded-full" title="مثبت"></div>}
                </div>
            );
        }
    };

    const ManualBadge = () => (
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <Badge className="bg-amber-500 hover:bg-amber-600 border-0 text-white shadow-lg text-[10px]">مثبت يدوياً</Badge>
        </div>
    );

    const EmptyState = ({ label }) => (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 p-4 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <Plus size={20} className="text-slate-300" />
            </div>
            <p className="text-xs">{label}</p>
        </div>
    );

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة قسم الترفيه" />

            <div className="py-8 mb-8 border-b border-slate-200/60">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <Music className="text-pink-600" size={32} /> إدارة قسم الترفيه والفنون
                </h1>
                <p className="text-slate-500 font-bold mt-2 text-sm">
                    تحكم كامل في قسم الترفيه. استخدم البحث لتثبيت أخبار محددة، أو اتركها لتُملأ تلقائياً.
                </p>
            </div>

            <section className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-6">
                        <RenderSlot name="main" />
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <RenderSlot name="vertical_1" />
                        <RenderSlot name="vertical_2" />
                    </div>

                    <div className="lg:col-span-3">
                        <RenderSlot name="agenda" />

                        <div className="flex flex-col bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                            <RenderSlot name="side_1" />
                            <RenderSlot name="side_2" />
                            <RenderSlot name="side_3" />
                        </div>
                    </div>
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
                            className="fixed top-2 bottom-2 left-2 w-full md:w-[600px] bg-white shadow-2xl z-[110] rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-100"
                        >
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-black text-[#001246] text-lg flex items-center gap-2">
                                    <Eye size={18} className="text-blue-500" /> معاينة سريعة
                                </h3>
                                <button onClick={() => setPreviewPost(null)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
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

Entertainment.layout = page => <AdminLayout children={page} />;
