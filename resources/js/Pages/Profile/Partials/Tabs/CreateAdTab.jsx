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
    FaArrowRight
} from 'react-icons/fa';

export default function CreateAdTab({ remainingDays, setActiveTab }) {
    const { auth } = usePage().props;
    const adCredits = remainingDays ?? auth.user.ad_credits ?? 0;
    const [imagePreview, setImagePreview] = useState(null);

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
                // تحديث البيانات المهمة قبل العودة
                router.reload({ only: ['ad_requests', 'stats'] });
                setActiveTab('ads');
            }
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
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

            <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-6 md:p-8 relative flex-grow flex flex-col">
                {adCredits < 1 && (
                    <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 shrink-0">
                        <div className="bg-white p-2 rounded-full shadow-sm"><FaTimesCircle /></div>
                        <div className="text-sm font-bold">عذراً، رصيدك الحالي لا يسمح بإنشاء حملات جديدة. يرجى الترقية.</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <InputLabel value="عنوان الحملة" className="text-gray-700 font-bold" />
                            <div className="relative">
                                <TextInput
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-brand-blue/20 bg-white shadow-sm font-bold"
                                    placeholder="مثال: خصم 50% لفترة محدودة"
                                />
                                <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel value="رابط التوجيه (Target URL)" className="text-gray-700 font-bold" />
                            <div className="relative">
                                <TextInput
                                    value={data.target_url}
                                    onChange={e => setData('target_url', e.target.value)}
                                    className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-brand-blue/20 bg-white shadow-sm font-sans"
                                    placeholder="https://example.com"
                                    dir="ltr"
                                />
                                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <InputError message={errors.target_url} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <InputLabel value="تاريخ البدء" className="text-gray-700 font-bold" />
                            <div className="relative">
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-brand-blue/20 bg-white shadow-sm"
                                />
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel value="المدة (أيام)" className="text-gray-700 font-bold" />
                            <div className="relative">
                                <TextInput
                                    type="number"
                                    value={data.duration}
                                    onChange={e => setData('duration', e.target.value)}
                                    className={`w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-brand-blue/20 bg-white shadow-sm font-bold ${data.duration > adCredits ? 'border-red-500 text-red-600' : ''}`}
                                    min="1"
                                    max="30"
                                />
                                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {data.duration > adCredits ? (
                                <p className="text-xs text-red-500 mt-1 font-bold flex items-center gap-1"><FaTimesCircle /> المدة تتجاوز الرصيد</p>
                            ) : (
                                <p className="text-xs text-green-600 mt-1 font-bold flex items-center gap-1"><FaCheckCircle /> الرصيد كافٍ</p>
                            )}
                            <InputError message={errors.duration} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel value="صورة الإعلان" className="text-gray-700 font-bold" />
                            <div className="relative">
                                <label className="flex items-center gap-3 w-full p-2 bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-blue/50 hover:bg-blue-50/30 transition-all">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover rounded-xl" /> : <FaImage size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">
                                            {data.image ? data.image.name : 'اضغط لاختيار صورة'}
                                        </p>
                                        <p className="text-[10px] text-gray-400">JPG, PNG بحد أقصى 2MB</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <InputError message={errors.image} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200/60 mt-auto">
                        <Button
                            disabled={processing || adCredits < data.duration}
                            className="bg-[#000a2e] hover:bg-brand-red text-white font-bold h-14 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2"
                        >
                            {processing ? 'جاري المعالجة...' : 'تأكيد ودفع النقاط'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
