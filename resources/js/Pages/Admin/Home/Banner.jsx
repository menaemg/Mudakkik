import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { FaNewspaper, FaAd, FaSave, FaSpinner, FaExternalLinkAlt, FaExclamationTriangle } from 'react-icons/fa';
import InputLabel from '@/Components/InputLabel';
import { Button } from "@/components/ui/button";
import BannerSection from "@/Pages/Home/BannerSection";

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function Banner({ currentSettings, activeAd }) {

    const [previewData, setPreviewData] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        type: currentSettings.type || 'post',
        post_id: currentSettings.post_id,
    });

    useEffect(() => {
        if (data.type === 'post') {
            if (currentSettings.post && currentSettings.post.id === data.post_id) {
                setPreviewData({
                    title: currentSettings.post.title,
                    description: currentSettings.post.excerpt,
                    image: getImageUrl(currentSettings.post.image),
                    category: currentSettings.post.category?.name,
                    link: '#'
                });
            }
        } else {
            if (activeAd) {
                setPreviewData({
                    title: activeAd.company_name || activeAd.title || 'إعلان ترويجي',
                    description: activeAd.notes || 'اضغط للتفاصيل',
                    image: getImageUrl(activeAd.image_path || activeAd.desktop_image),
                    category: 'شريك استراتيجي',
                    link: activeAd.link || '#'
                });
            } else {
                setPreviewData(null);
            }
        }
    }, [data.type, currentSettings.post, activeAd]);


    const loadOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);
        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => res.data.map(post => ({
                value: post.id,
                label: post.title,
                image: getImageUrl(post.image),
                post_data: post
            })));
    };

    const handlePostChange = (option) => {
        setData('post_id', option?.value);
        if (option) {
            setPreviewData({
                title: option.post_data.title,
                description: option.post_data.excerpt,
                image: option.image,
                category: option.post_data.category?.name || 'عام',
                link: '#'
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.home.banner.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة البانر الرئيسي" />

            <div className="py-8 mb-8 border-b border-slate-200/60 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                        <FaNewspaper className="text-brand-blue" /> البانر الرئيسي
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 text-sm">
                        تحكم في المصدر الذي يظهر في البانر (خبر أو نظام الإعلانات).
                    </p>
                </div>
                <Button onClick={handleSubmit} disabled={processing} className="bg-brand-blue
                hover:bg-blue-800 text-white px-8 py-6 rounded-xl
                shadow-lg flex
                items-center gap-2 font-bold text-lg">
                    {processing ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    حفظ الإعدادات
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">

                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-8">
                        <button
                            onClick={() => setData('type', 'post')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all
                              ${data.type === 'post' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FaNewspaper /> عرض خبر
                        </button>
                        <button
                            onClick={() => setData('type', 'ad')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all
                              ${data.type === 'ad' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FaAd /> عرض إعلان
                        </button>
                    </div>

                    <div className="space-y-6">
                        {data.type === 'post' ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <InputLabel value="اختر الخبر يدوياً" className="mb-2" />
                                <AsyncSelect
                                    cacheOptions defaultOptions loadOptions={loadOptions} onChange={handlePostChange}
                                    defaultValue={currentSettings.post ? {
                                        value: currentSettings.post.id,
                                        label: currentSettings.post.title,
                                        image: getImageUrl(currentSettings.post.image)
                                    } : null}
                                    placeholder="ابحث عن عنوان المقال..."
                                    className="text-right"
                                    styles={{ control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "4px", borderColor: "#e2e8f0" }) }}
                                    dir="rtl"
                                />
                                {errors.post_id && <p className="text-red-500 text-xs mt-1">{errors.post_id}</p>}
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300 text-center space-y-4">
                                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaAd size={24} />
                                    </div>
                                    <h3 className="font-bold text-amber-800 mb-2">وضع الإعلانات مفعل</h3>
                                    <p className="text-sm text-amber-700/80 mb-4">
                                        سيتم عرض الإعلان النشط حالياً في خانة <strong>Main Banner</strong> تلقائياً من نظام الإعلانات.
                                    </p>

                                    <Link
                                        href={route('admin.home.banner.index')}
                                        className="inline-flex items-center gap-2 text-xs font-bold bg-white text-amber-700 border border-amber-200
                                        px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                                    >
                                        إدارة الإعلانات <FaExternalLinkAlt />
                                    </Link>
                                </div>

                                {!activeAd && (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg
                                    text-xs font-bold justify-center">
                                        <FaExclamationTriangle />
                                        تنبيه: لا يوجد إعلان نشط حالياً لهذا المكان!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-slate-700">المعاينة الحية</h3>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl
                        border border-dashed border-slate-200 p-4">
                            {previewData ? (
                                <div className="w-full transform scale-95 origin-top">
                                     <BannerSection data={previewData} type={data.type === 'post' ? 'news' : 'ad'} />
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <p>لا يوجد محتوى للعرض حالياً</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Banner.layout = page => <AdminLayout children={page} />;
