import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FaBullhorn, FaPlus, FaCalendarAlt, FaClock, FaImage, FaCoins } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";

export default function AdsTab({ adRequests }) {
    const { auth } = usePage().props;
    const adCredits = auth.user.credits?.ads || 0;

    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        target_url: '',
        image: null,
        start_date: '',
        duration: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ads.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
            }
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
            approved: "bg-green-100 text-green-700 hover:bg-green-200",
            rejected: "bg-red-100 text-red-700 hover:bg-red-200",
            waiting_payment: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        };
        const labels = {
            pending: "قيد المراجعة",
            approved: "تمت الموافقة",
            rejected: "مرفوض",
            waiting_payment: "بانتظار الدفع",
        };
        return <Badge className={`${styles[status] || styles.pending} border-0`}>{labels[status] || status}</Badge>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FaBullhorn className="text-brand-blue" /> إدارة حملاتي الإعلانية
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">تابع حالة إعلاناتك أو قم بإنشاء حملة جديدة.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full p-1">
                            <FaCoins size={12} />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-green-600 font-bold">الرصيد المتاح</p>
                            <p className="text-sm font-black text-green-700">{adCredits} أيام</p>
                        </div>
                    </div>

                    <Button onClick={() => setIsCreating(!isCreating)} className={`${isCreating ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-brand-blue hover:bg-blue-700 text-white'} shadow-lg font-bold transition-all`}>
                        {isCreating ? 'إلغاء' : <><FaPlus className="ml-2" /> إعلان جديد</>}
                    </Button>
                </div>
            </div>

            {isCreating && (
                <div className="bg-white rounded-2xl shadow-md border border-brand-blue/20 p-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                    {adCredits < 1 && (
                        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-bold text-center py-1">
                            تنبيه: رصيدك الحالي 0 أيام. يرجى شحن رصيدك أو ترقية الباقة لتتمكن من النشر.
                        </div>
                    )}

                    <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 mt-2">بيانات الإعلان الجديد</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="عنوان الحملة" />
                                <TextInput
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="مثال: خصم 50% على منتجاتنا"
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <InputLabel value="رابط التوجيه (Target URL)" />
                                <TextInput
                                    value={data.target_url}
                                    onChange={e => setData('target_url', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="https://your-website.com"
                                />
                                <InputError message={errors.target_url} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <InputLabel value="تاريخ البدء" />
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full mt-1"
                                />
                                <InputError message={errors.start_date} />
                            </div>
                            <div>
                                <InputLabel value="المدة (بالأيام)" />
                                <div className="relative">
                                    <TextInput
                                        type="number"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className={`w-full mt-1 ${data.duration > adCredits ? 'border-red-500 focus:border-red-500' : ''}`}
                                        min="1" max="30"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">يوم</span>
                                </div>
                                <InputError message={errors.duration} />
                                {data.duration > adCredits && (
                                    <p className="text-xs text-red-500 mt-1 font-bold">المدة تتجاوز رصيدك المتاح ({adCredits})</p>
                                )}
                            </div>
                            <div>
                                <InputLabel value="صورة الإعلان" />
                                <div className="mt-1 relative border border-gray-300 rounded-md bg-white p-2 flex items-center">
                                    <input
                                        type="file"
                                        onChange={e => setData('image', e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <InputError message={errors.image} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                disabled={processing || adCredits < data.duration}
                                className="bg-brand-blue w-full md:w-auto"
                            >
                                {processing ? 'جاري الإرسال...' : `إرسال للمراجعة (خصم ${data.duration} كريديت)`}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {adRequests && adRequests.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">الإعلان</th>
                                    <th className="px-6 py-4">التاريخ</th>
                                    <th className="px-6 py-4">المدة</th>
                                    <th className="px-6 py-4">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {adRequests.data.map((ad) => (
                                    <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                    <img src={`/storage/${ad.image_path}`} alt={ad.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{ad.title}</p>
                                                    <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-[150px]">{ad.target_url}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <FaCalendarAlt /> {new Date(ad.requested_start_date).toLocaleDateString('ar-EG')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 flex items-center gap-1 w-fit">
                                                <FaClock size={10} />
                                                {Math.ceil((new Date(ad.requested_end_date) - new Date(ad.requested_start_date)) / (1000 * 60 * 60 * 24))} يوم
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(ad.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FaBullhorn className="text-3xl text-gray-300" />
                        </div>
                        <p className="font-medium">لا توجد طلبات إعلانية حتى الآن.</p>
                        <Button variant="link" onClick={() => setIsCreating(true)} className="text-brand-blue mt-1">ابدأ أول حملة لك</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
