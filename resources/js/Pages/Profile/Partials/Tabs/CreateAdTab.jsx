import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import {
    FaPlus,
    FaCalendarAlt,
    FaClock,
    FaImage,
    FaCheckCircle,
    FaTimesCircle,
    FaHeading,
    FaGlobe,
    FaArrowRight,
    FaCloudUploadAlt
} from 'react-icons/fa';

export default function CreateAdTab({ remainingDays, setActiveTab }) {
    const { auth } = usePage().props;
    const adCredits = remainingDays ?? auth.user.ad_credits ?? 0;
    const [imagePreview, setImagePreview] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: '',
        target_url: '',
        image: null,
        start_date: '',
        duration: 1,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
            clearErrors('image');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ads.store'), {
            forceFormData: true,
            onSuccess: () => {
                router.reload({ only: ['ad_requests', 'stats'] });
                setActiveTab('ads');
            }
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h3 className="font-black text-2xl text-[#020617] flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                            <FaPlus size={18} />
                        </div>
                        إطلاق حملة جديدة
                    </h3>
                    <p className="text-gray-500 font-medium text-sm">قم بملء البيانات التالية لبدء حملتك الإعلانية.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setActiveTab('ads')}
                    className="border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-5 h-10 gap-2 font-bold"
                >
                    <FaArrowRight size={12} /> إلغاء وتراجع
                </Button>
            </div>

            <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-6 md:p-8 relative flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                {adCredits < 1 && (
                    <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 shrink-0 animate-pulse">
                        <div className="bg-white p-2 rounded-full shadow-sm"><FaTimesCircle /></div>
                        <div className="text-sm font-bold">عذراً، رصيدك الحالي لا يسمح بإنشاء حملات جديدة. يرجى الترقية.</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col">

                    <div className="w-full">
                        <InputLabel value="صورة الإعلان (Banner)" className="text-gray-800 font-black text-sm mb-3 block" />
                        <label
                            className={`
                                group relative flex flex-col items-center justify-center w-full h-56 md:h-64
                                border-2 border-dashed rounded-[1.5rem] cursor-pointer
                                transition-all duration-300 overflow-hidden bg-white
                                ${errors.image ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-brand-blue hover:bg-blue-50/30'}
                                ${imagePreview ? 'border-brand-blue ring-2 ring-brand-blue/10' : ''}
                            `}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                        <FaCloudUploadAlt size={40} className="mb-2" />
                                        <span className="font-bold">اضغط لتغيير الصورة</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-brand-blue transition-colors">
                                    <div className="p-4 bg-gray-50 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <FaImage size={32} />
                                    </div>
                                    <p className="mb-2 text-sm font-bold text-gray-600"><span className="text-brand-blue underline">اضغط للرفع</span> أو اسحب الصورة هنا</p>
                                    <p className="text-xs text-gray-400">PNG, JPG (الحد الأقصى 2MB)</p>
                                </div>
                            )}
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <InputLabel value="عنوان الحملة" className="text-gray-700 font-bold" />
                            <div className="relative group">
                                <TextInput
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full pl-12 py-4 h-14 rounded-2xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 bg-white shadow-sm font-bold transition-all group-hover:border-gray-300"
                                    placeholder="مثال: خصم 50% لفترة محدودة"
                                />
                                <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            </div>
                            <InputError message={errors.title} />
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <InputLabel value="رابط التوجيه (Target URL)" className="text-gray-700 font-bold" />
                            <div className="relative group">
                                <TextInput
                                    value={data.target_url}
                                    onChange={e => setData('target_url', e.target.value)}
                                    className="w-full pl-12 py-4 h-14 rounded-2xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 bg-white shadow-sm font-sans transition-all group-hover:border-gray-300"
                                    placeholder="https://example.com"
                                    dir="ltr"
                                />
                                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            </div>
                            <InputError message={errors.target_url} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <InputLabel value="تاريخ البدء" className="text-gray-700 font-bold" />
                            <div className="relative group">
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full pl-12 py-4 h-14 rounded-2xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 bg-white shadow-sm transition-all group-hover:border-gray-300"
                                    min={today}
                                />
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            </div>
                            <InputError message={errors.start_date} />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <InputLabel value="المدة (أيام)" className="text-gray-700 font-bold" />
                            <div className="relative group">
                                <TextInput
                                    type="number"
                                    value={data.duration}
                                    onChange={e => setData('duration', e.target.value)}
                                    className={`w-full pl-12 py-4 h-14 rounded-2xl border-gray-200 focus:ring-brand-blue/20 bg-white shadow-sm font-bold transition-all group-hover:border-gray-300 ${data.duration > adCredits ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-200' : 'focus:border-brand-blue'}`}
                                    min="1"
                                    max="30"
                                />
                                <FaClock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${data.duration > adCredits ? 'text-red-400' : 'text-gray-400 group-focus-within:text-brand-blue'}`} />
                            </div>

                            <div className="flex justify-between items-center px-1">
                                {data.duration > adCredits ? (
                                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 animate-pulse"><FaTimesCircle /> المدة تتجاوز الرصيد المتاح</p>
                                ) : (
                                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1"><FaCheckCircle /> الرصيد كافٍ للعملية</p>
                                )}
                                <span className="text-[10px] text-gray-400 font-medium">الحد الأقصى: 30 يوم</span>
                            </div>
                            <InputError message={errors.duration} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-auto">
                        <Button
                            disabled={processing || adCredits < data.duration}
                            className="bg-[#000a2e] hover:bg-blue-900 text-white font-bold h-14 px-10 rounded-2xl shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-3 text-base"
                        >
                            {processing ? 'جاري المعالجة...' : 'تأكيد ودفع النقاط'}
                            {!processing && <FaCheckCircle />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
