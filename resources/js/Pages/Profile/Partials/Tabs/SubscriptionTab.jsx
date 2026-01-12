import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';
import { Badge } from "@/components/ui/badge";
import {
    FaCrown, FaCalendarAlt, FaCreditCard,
    FaHistory, FaHeadset, FaRobot, FaAd, FaMedal, FaTimesCircle, FaCalendarCheck, FaCheckCircle
} from 'react-icons/fa';

export default function SubscriptionTab({ subscription, plan, subscription_history }) {

    const isFree = !subscription || plan?.slug === 'free' || plan?.is_free;

    const getFeatureDisplay = (key, value) => {
        switch (key) {
            case 'monthly_ai_credits':
                return {
                    text: `${value} عملية كشف حقائق (AI) شهرياً`,
                    icon: FaRobot,
                    color: 'text-indigo-600',
                    bg: 'bg-indigo-50 border-indigo-100'
                };
            case 'monthly_ad_credits':
                return value > 0 ? {
                    text: `${value} أيام رصيد إعلاني شهرياً`,
                    icon: FaAd,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50 border-emerald-100'
                } : {
                    text: 'لا يوجد رصيد إعلاني',
                    icon: FaTimesCircle,
                    color: 'text-red-400',
                    bg: 'bg-red-50 border-red-100'
                };
            case 'verification_badge':
                if (!value) return {
                    text: 'بدون شارة توثيق',
                    icon: FaMedal,
                    color: 'text-gray-400',
                    bg: 'bg-gray-50 border-gray-100'
                };
                const badges = { bronze: 'برونزية', gold: 'ذهبية', platinum: 'بلاتينية' };
                return {
                    text: `شارة توثيق ${badges[value] || value}`,
                    icon: FaMedal,
                    color: value === 'gold' ? 'text-amber-600' : (value === 'platinum' ? 'text-slate-600' : 'text-orange-700'),
                    bg: value === 'gold' ? 'bg-amber-50 border-amber-100' : (value === 'platinum' ? 'bg-slate-100 border-slate-200' : 'bg-orange-50 border-orange-100')
                };
            case 'priority_support':
                return value ? {
                    text: 'دعم فني مباشر (VIP)',
                    icon: FaHeadset,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50 border-purple-100'
                } : {
                    text: 'دعم فني قياسي',
                    icon: FaHeadset,
                    color: 'text-gray-500',
                    bg: 'bg-gray-50 border-gray-100'
                };
            default:
                return null;
        }
    };

    const prepareFeaturesList = () => {
        if (!plan?.features) return [];

        let features = plan.features;
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch (e) {
                console.error("Error parsing features JSON", e);
                return [];
            }
        }

        const order = ['verification_badge', 'monthly_ai_credits', 'monthly_ad_credits', 'priority_support'];

        return order.map(key => {
            if (features && features.hasOwnProperty(key)) {
                return getFeatureDisplay(key, features[key]);
            }
            return null;
        }).filter(Boolean);
    };

    const currentFeatures = prepareFeaturesList();

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ar-EG');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 flex flex-col min-h-[calc(100vh-16rem)] h-full">

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white overflow-hidden relative shrink-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>

                <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 hover:rotate-6 shrink-0
                            ${isFree ? 'bg-gray-50 text-gray-300 border border-gray-100' :
                                plan?.slug?.includes('annual') ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-amber-400 border-4 border-white ring-4 ring-gray-100' :
                                    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-4 border-white ring-4 ring-indigo-50'}`}>
                            <FaCrown className={plan?.slug?.includes('annual') ? "drop-shadow-glow" : ""} />
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-[#020617] tracking-tight mb-1">
                                        {plan?.name || 'جاري التحميل...'}
                                    </h2>
                                    <p className="text-gray-500 font-medium text-sm">
                                        {isFree
                                            ? 'أنت تستخدم الباقة الأساسية. رقي الآن لتفتح إمكانياتك.'
                                            : plan?.slug?.includes('annual')
                                                ? 'عضوية VIP سنوية - أنت من نخبة مجتمعنا.'
                                                : 'عضوية احترافية تمنحك الأولوية والتميز.'}
                                    </p>
                                </div>

                                {isFree ? (
                                    <Badge className="bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 pointer-events-none py-2 px-4 text-xs rounded-xl">
                                        مجاني
                                    </Badge>
                                ) : (
                                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold shadow-sm
                                        ${subscription?.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        <div className={`w-2 h-2 rounded-full ${subscription?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        {subscription?.status === 'active' ? 'اشتراك نشط' : 'غير نشط'}
                                    </div>
                                )}
                            </div>

                            {!isFree && subscription && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                            <FaCalendarAlt size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">تاريخ البدء</span>
                                            <span className="text-sm font-bold text-gray-700 dir-ltr font-mono">{formatDate(subscription.start_at || subscription.created_at)}</span>
                                        </div>
                                    </div>

                                    {subscription.ends_at && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                                <FaCalendarCheck size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {subscription.status === 'active' ? 'التجديد القادم' : 'تاريخ الانتهاء'}
                                                </span>
                                                <span className="text-sm font-bold text-gray-700 dir-ltr font-mono">{formatDate(subscription.ends_at)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                        {isFree ? (
                            <Link href={route('plans.index')} className="w-full">
                                <Button className="w-full h-14 bg-[#020617] hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-gray-200 transition-transform hover:-translate-y-1 text-base">
                                    <FaCrown className="ml-2 text-yellow-400" /> ترقية لحساب احترافي
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('plans.index')} className="flex-1">
                                    <Button variant="outline" className="w-full h-12 border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700 font-bold rounded-xl transition-all">
                                        تغيير الخطة
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="flex-1 w-full h-12 border-2 border-red-50 hover:border-red-100 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all"
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'هل أنت متأكد؟',
                                            text: 'سيتم إلغاء اشتراكك. سيظل الاشتراك فعالاً حتى تاريخ انتهائه.',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#dc2626',
                                            cancelButtonColor: '#6b7280',
                                            confirmButtonText: 'نعم، إلغاء الاشتراك',
                                            cancelButtonText: 'تراجع',
                                            customClass: {
                                                popup: 'font-[Cairo]'
                                            }
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                router.post(route('subscription.cancel'));
                                            }
                                        });
                                    }}
                                >
                                    إلغاء الاشتراك
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow h-full">

                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 h-full">
                    <h4 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500" /> مميزات باقتك
                    </h4>
                    {currentFeatures.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentFeatures.map((feature, index) => (
                                <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${feature.bg}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm ${feature.color}`}>
                                        <feature.icon size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">لا توجد مميزات إضافية للعرض في هذه الباقة</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 flex flex-col h-full">
                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                        <FaHistory className="text-gray-400" /> السجل السابق
                    </h4>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                        {subscription_history && subscription_history.length > 0 ? (
                            <div className="space-y-4">
                                {subscription_history.map((sub) => (
                                    <div key={sub.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-gray-900">{sub.plan?.name}</span>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-[10px] h-5 rounded-lg">منتهي</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono bg-gray-50 p-2 rounded-xl justify-center">
                                            <span dir="ltr">{formatDate(sub.start_at || sub.created_at)}</span>
                                            <span className="text-gray-300">➜</span>
                                            <span dir="ltr">{formatDate(sub.ends_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 min-h-[150px]">
                                <FaHistory size={32} className="mb-3 opacity-20" />
                                <p className="text-xs font-medium">لا يوجد سجل اشتراكات سابق</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
