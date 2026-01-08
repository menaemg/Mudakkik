import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FaEdit, FaCalendarAlt, FaClock, FaImage, FaHeading, FaGlobe, FaArrowRight, FaCheckCircle, FaExchangeAlt, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function EditAdTab({ ad, remainingDays, setActiveTab }) {
    const { auth } = usePage().props;

    const originalDuration = parseInt(ad.duration || 0, 10);

    const currentCredits = remainingDays ?? auth.user.ad_credits ?? 0;


    const [imagePreview, setImagePreview] = useState(ad.image_path ? `/storage/${ad.image_path}` : null);
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        _method: 'PUT',
        title: ad.title,
        target_url: ad.target_url,
        image: null,
        start_date: ad.requested_start_date,
        duration: ad.duration,
    });

    const currentDuration = parseInt(data.duration || 0, 10);
    const durationDifference = currentDuration - originalDuration;
    const canAfford = durationDifference > 0 ? currentCredits >= durationDifference : true;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
            clearErrors('image');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canAfford) return;

        Swal.fire({
            title: 'حفظ التعديلات؟',
            text: durationDifference > 0
                ? `سيتم خصم ${durationDifference} أيام إضافية من رصيدك.`
                : (durationDifference < 0 ? `سيتم استرجاع ${Math.abs(durationDifference)} أيام إلى رصيدك.` : "لن يتم تغيير رصيدك."),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، حفظ',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('ads.update', ad.id), {
                    forceFormData: true,
                    onSuccess: () => {
                        router.reload({ only: ['ad_requests', 'stats'] });
                        setActiveTab('ads');
                        Swal.fire('تم!', 'تم تعديل الحملة بنجاح.', 'success');
                    },
                    onError: (err) => {
                         if(err.general) Swal.fire('خطأ', err.general, 'error');
                    }
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h3 className="font-black text-2xl text-[#020617] flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-sm border border-amber-100">
                            <FaEdit size={18} />
                        </div>
                        تعديل الحملة
                    </h3>
                    <p className="text-gray-500 font-medium text-sm">يمكنك تعديل تفاصيل الحملة طالما أنها قيد المراجعة.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setActiveTab('ads')}
                    className="border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-5 h-10 gap-2 font-bold"
                >
                    <FaArrowRight size={12} /> إلغاء
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel value="عنوان الحملة" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <TextInput
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-amber-500/20 bg-white shadow-sm font-bold"
                            />
                            <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <InputError message={errors.title} />
                    </div>
                    <div className="space-y-2">
                        <InputLabel value="رابط التوجيه" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <TextInput
                                value={data.target_url}
                                onChange={e => setData('target_url', e.target.value)}
                                className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-amber-500/20 bg-white shadow-sm font-sans"
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
                                className="w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-amber-500/20 bg-white shadow-sm"
                                min={today}
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
                                className={`w-full pl-12 py-4 rounded-2xl border-gray-200 focus:ring-amber-500/20 bg-white shadow-sm font-bold ${!canAfford ? 'border-red-500 text-red-600' : ''}`}
                                min="1" max="30"
                            />
                            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="text-xs font-bold mt-2 flex items-center gap-1 transition-all duration-300 h-6">
                            {durationDifference > 0 ? (
                                canAfford ? (
                                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                        <FaExchangeAlt className="inline mx-1"/> سيتم خصم {durationDifference} يوم إضافي
                                    </span>
                                ) : (
                                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 flex items-center gap-1">
                                        <FaExclamationTriangle /> الرصيد لا يكفي ({currentCredits} متاح)
                                    </span>
                                )
                            ) : durationDifference < 0 ? (
                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                    <FaExchangeAlt className="inline mx-1"/> سيتم استرجاع {Math.abs(durationDifference)} يوم
                                </span>
                            ) : (
                                <span className="text-gray-400 flex items-center gap-1">
                                    <FaCheckCircle className="text-gray-300"/> نفس المدة الحالية
                                </span>
                            )}
                        </div>
                        <InputError message={errors.duration} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="تحديث الصورة (اختياري)" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <label className="flex items-center gap-3 w-full p-2 bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-amber-500/50 hover:bg-amber-50/30 transition-all">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover rounded-xl" /> : <FaImage size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-700 truncate">تغيير الصورة</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <InputError message={errors.image} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200/60 mt-auto">
                    <Button
                        disabled={processing || !canAfford}
                        className={`font-bold h-14 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2 ${!canAfford ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                    >
                        {processing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
