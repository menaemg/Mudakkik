import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Search, X, Calendar, Megaphone, Check } from 'lucide-react';
import { FaArrowLeft, FaBell, FaBolt } from 'react-icons/fa';
import { getImagePath } from '@/utils';
export default function TopicsSection({ alertsData, categories, upcomingAd }) {

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
            section: 'editor_alerts', slot_name: slotName, post_id: option.value
        }, { preserveScroll: true });
    };

    const handleReset = (slotName) => {
        router.post(route('admin.home.topics.update'), {
            section: 'editor_alerts', slot_name: slotName, post_id: null
        }, { preserveScroll: true });
    };


    const TopicCard = ({ topic }) => (
        <div className="group cursor-default bg-white rounded-xl shadow-sm border border-gray-100 block h-full min-w-[220px]">
            <div className="h-28 overflow-hidden relative">
                <img
                    src={getImagePath(topic.representative_image)}
                    alt={topic.name}
                    className="w-full h-full object-cover transition-transform
                    duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-4 flex justify-between items-center text-right">
                <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">{topic.name}</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{topic.posts_count || 0} مقال</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center
                text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <FaArrowLeft className="text-[10px]" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="font-sans min-h-screen bg-gray-50/30" dir="rtl">
            <Head title="إدارة قسم المواضيع" />

            <div className="bg-white border-b border-gray-200 px-8
            py-4 mb-8 sticky top-0 z-50 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-black text-[#001246] flex items-center gap-2">
                    <Megaphone size={20} className="text-[#b20e1e]"/> إدارة قسم المواضيع والتنبيهات
                </h1>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Live Edit Mode
                </Badge>
            </div>

            <section className="container mx-auto px-4 pb-20">

                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <div className="flex flex-col text-right">
                        <span className="text-[#b20e1e] font-bold text-xs tracking-widest uppercase mb-1">اكتشف (تلقائي)</span>
                        <h2 className="text-3xl font-black text-gray-900">تصفح حسب الموضوع</h2>
                    </div>
                </div>

                <div className="mb-16 relative overflow-x-auto pb-6 custom-scrollbar">
                    <div className="flex gap-4 w-max px-2">
                        {categories.map((topic) => (
                            <div key={topic.id} className="w-[240px]">
                                <TopicCard topic={topic} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6 justify-start">
                    <div className="p-2 bg-red-100 text-[#b20e1e] rounded-full">
                        <FaBell />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">تنبيهات المحرر</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {alertsData.map((slot) => (
                        <div key={slot.slot_name} className="relative group/admin h-full">

                            {slot.post ? (
                                <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 h-full text-right relative">
                                    <button
                                        onClick={() => handleReset(slot.slot_name)}
                                        className="absolute top-2 left-2 z-20 bg-white/90 text-red-600 p-2 rounded-full shadow-md border border-red-100 hover:bg-red-600 hover:text-white transition-colors"
                                        title="إزالة هذا التنبيه"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                         <img src={getImagePath(slot.post.image)} alt={slot.post.title} className="w-full h-full object-cover" />
                                         <div className="absolute top-2 right-2 md:hidden">
                                            <Badge className="bg-red-600">{slot.post.category?.name}</Badge>
                                         </div>
                                    </div>
                                    <div className="p-5 flex flex-col justify-center flex-1">
                                         <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="hidden md:flex text-[#b20e1e] border-[#b20e1e]/20 bg-red-50 hover:bg-red-100 text-[10px] font-bold">
                                                {slot.post.category?.name}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                                <FaBolt size={10} className="text-yellow-500" /> تنبيه المحرر #{slot.slot_name}
                                            </span>
                                         </div>
                                        <h3 className="text-lg font-bold leading-snug text-gray-900 mb-3 line-clamp-2">
                                            {slot.post.title}
                                        </h3>
                                         <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto justify-end">
                                            <span>{new Date(slot.post.created_at).toLocaleDateString('ar-EG')}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="font-medium text-gray-700">{slot.post.user?.name}</span>
                                            <Avatar className="w-6 h-6 border border-gray-200">
                                                <AvatarImage src={getImagePath(slot.post.user?.avatar)} />
                                                <AvatarFallback>AU</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[200px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#b20e1e]/50 flex flex-col items-center justify-center p-6 transition-colors">
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-2 text-gray-400">
                                            <Search size={20} />
                                        </div>
                                        <h4 className="font-bold text-gray-600">مكان فارغ #{slot.slot_name}</h4>
                                        <p className="text-xs text-gray-400">اختر مقالاً لعرضه كتنبيه محرر</p>
                                    </div>
                                    <div className="w-full max-w-xs relative">
                                        <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadOptions}
                                            onChange={(opt) => handleUpdate(slot.slot_name, opt)}
                                            placeholder="ابحث عن المقال..."
                                            className="text-right text-sm"
                                            styles={{
                                                control: (base) => ({ ...base, borderRadius: '0.75rem', borderColor: '#e5e7eb', boxShadow: 'none' }),
                                                menu: (base) => ({ ...base, zIndex: 50 })
                                            }}
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 h-28 bg-white border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-20 flex items-center gap-1">
                        <Megaphone size={10} /> معاينة الإعلان القادم
                    </div>

                    {upcomingAd ? (
                        <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
                                <div className="text-center">
                                    <p className="font-bold text-lg">{upcomingAd.user?.name}</p>
                                    <div className="flex items-center gap-2 text-sm justify-center mt-1">
                                        <Calendar size={14} />
                                        <span>يبدأ: {new Date(upcomingAd.start_date).toLocaleDateString('ar-EG')}</span>
                                        <span>(لمدة {upcomingAd.number_of_days} يوم)</span>
                                    </div>
                                </div>
                            </div>

                            <img
                                src={getImagePath(upcomingAd.image_url)}
                                alt={upcomingAd.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                             <span className="font-bold text-gray-500 block">مساحة إعلانية متوفرة</span>
                             <span className="text-[10px]">لا يوجد إعلانات محجوزة لهذا القسم قريباً</span>
                        </div>
                    )}
                </div>

            </section>
        </div>
    );
}

TopicsSection.layout = page => <AdminLayout children={page} />;
