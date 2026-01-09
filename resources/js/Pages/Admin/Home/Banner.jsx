import React, { useState, useMemo } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { FaNewspaper, FaCheckCircle, FaAd } from 'react-icons/fa';
import InputLabel from '@/Components/InputLabel';
import Swal from 'sweetalert2';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage/')) return path;
    return `/storage/${path}`;
};

const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const PostBanner = ({ post }) => (
    <div className="w-full h-full rounded-2xl bg-cover bg-center relative group overflow-hidden"
         style={{ backgroundImage: `url(${post.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 w-full p-6 flex flex-col justify-end z-10 text-right">
            <span className="inline-block bg-brand-red text-white text-[10px] px-2 py-1 rounded mb-2 w-fit">
                خبر مثبت
            </span>
            <h2 className="text-white text-xl md:text-2xl font-bold mb-2 line-clamp-2 leading-snug">{post.title}</h2>
        </div>
    </div>
);
export default function Banner({ currentSettings }) {

    const selectedPost = useMemo(() => {
        if (!currentSettings.post) return null;
        return {
            ...currentSettings.post,
            image: getImageUrl(currentSettings.post.image)
        };
    }, [currentSettings.post]);

    const loadOptions = (inputValue) => {
        if (!inputValue || inputValue.length < 2) return Promise.resolve([]);

        return axios.get(route('admin.posts.search', { query: inputValue }))
            .then((res) => {
                if(!res.data) return [];
                return res.data.map(post => ({
                    value: post.id,
                    label: post.title,
                    post_data: { ...post, image: getImageUrl(post.image) }
                }));
            })
            .catch(err => {
                console.error("Search Error:", err);
                return [];
            });
    };

    const handlePostChange = (option) => {
        const isClearing = option === null;
        const newPostId = isClearing ? null : option.value;

        router.post(route('admin.home.banner.update'), {
            type: 'post',
            post_id: newPostId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (isClearing) {
                    Toast.fire({ icon: 'info', title: 'تم إلغاء التثبيت. عاد وضع الإعلانات.' });
                } else {
                    Toast.fire({ icon: 'success', title: 'تم تثبيت الخبر بنجاح!' });
                }
            },
            onError: (errors) => {
                console.error(errors);
                Toast.fire({ icon: 'error', title: 'حدث خطأ أثناء الحفظ.' });
            },
        });
    };

    const selectValue = selectedPost ? {
        value: selectedPost.id,
        label: selectedPost.title
    } : null;

    return (
        <div className="font-sans pb-20 px-4 md:px-8 rtl bg-[#F8FAFC] min-h-screen" dir="rtl">
            <Head title="إدارة البانر الرئيسي" />

            <div className="py-8 mb-8 border-b border-slate-200/60">
                <h1 className="text-3xl font-black text-[#001246] flex items-center gap-3">
                    <FaNewspaper className="text-brand-blue" /> البانر الرئيسي
                </h1>
                <p className="text-slate-500 font-bold mt-2 text-sm">
                    تحكم في الخبر المثبت في واجهة الموقع الرئيسية.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                <div className="xl:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
                    <div className="space-y-6">
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <InputLabel value="اختر خبراً لتثبيته" className="mb-2 text-xs font-bold text-slate-500" />
                            <div className="relative">
                                <AsyncSelect
                                    key={`select-${selectedPost ? selectedPost.id : 'empty'}`}
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadOptions}
                                    onChange={handlePostChange}
                                    value={selectValue}
                                    placeholder="ابحث عن عنوان المقال..."
                                    className="text-right"
                                    styles={{
                                        control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "4px", borderColor: "#e2e8f0" }),
                                        menu: (base) => ({ ...base, zIndex: 100 })
                                    }}
                                    dir="rtl"
                                    isClearable={true}
                                    backspaceRemovesValue={true}
                                    noOptionsMessage={() => "لا توجد نتائج"}
                                    loadingMessage={() => "جاري البحث..."}
                                />
                            </div>

                            {selectedPost ? (
                                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                                        <FaCheckCircle /> هذا الخبر مثبت الآن
                                    </div>
                                    <p className="text-xs text-green-600 pr-6">
                                        يظهر هذا الخبر للزوار. اضغط (X) بالأعلى للعودة لوضع الإعلانات.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
                                        <FaAd /> وضع الإعلانات التلقائي مفعل
                                    </div>
                                    <p className="text-xs text-amber-600 pr-6">
                                        لأنك لم تختر خبراً مثبتاً، الموقع الآن يعرض الإعلانات أو التصميم الافتراضي.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-slate-700">المعاينة الحية</h3>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                            <div className="w-full h-[350px] md:h-[400px] shadow-lg rounded-2xl overflow-hidden bg-white transform transition-all">
                                {selectedPost ? (
                                    <PostBanner post={selectedPost} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-sm">
                                            <FaAd className="text-3xl" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-slate-600">وضع الإعلانات نشط</p>
                                            <p className="text-sm text-slate-400 mt-1">لا يوجد خبر مثبت حالياً.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Banner.layout = page => <AdminLayout children={page} />;
