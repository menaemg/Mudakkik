import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FaCrown, FaCheckCircle, FaCalendarAlt, FaCreditCard,
    FaStar, FaHistory, FaHeadset, FaRobot, FaAd, FaMedal, FaTimesCircle, FaCalendarCheck
} from 'react-icons/fa';

export default function SubscriptionTab({ subscription, plan, subscription_history }) {

    const isFree = !subscription || plan?.slug === 'free' || plan?.is_free;

    const getPlanFeatures = (slug) => {
        switch (slug) {
            case 'free':
                return [
                    { text: 'دعم فني قياسي', icon: FaHeadset, color: 'text-gray-500', bg: 'bg-gray-50' },
                    { text: 'بدون شارة توثيق', icon: FaMedal, color: 'text-gray-400', bg: 'bg-gray-50' },
                    { text: '30 عملية كشف حقائق (AI)', icon: FaRobot, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { text: 'لا يوجد رصيد إعلاني', icon: FaTimesCircle, color: 'text-red-400', bg: 'bg-red-50' },
                ];
            case 'basic':
                return [
                    { text: 'دعم فني قياسي', icon: FaHeadset, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { text: 'شارة توثيق برونزية', icon: FaMedal, color: 'text-amber-700', bg: 'bg-amber-50' },
                    { text: '100 عملية كشف حقائق (AI)', icon: FaRobot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { text: '7 أيام إعلانات ممولة', icon: FaAd, color: 'text-green-600', bg: 'bg-green-50' },
                ];
            case 'professional':
                return [
                    { text: 'دعم فني مباشر VIP', icon: FaHeadset, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { text: 'شارة توثيق ذهبية (Gold)', icon: FaMedal, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { text: '1000 عملية كشف حقائق (AI)', icon: FaRobot, color: 'text-indigo-700', bg: 'bg-indigo-50' },
                    { text: '30 يوم إعلانات ممولة', icon: FaAd, color: 'text-green-700', bg: 'bg-green-50' },
                ];
            case 'professional-annual':
                return [
                    { text: 'دعم فني مباشر VIP', icon: FaHeadset, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { text: 'شارة توثيق بلاتينية (VIP)', icon: FaMedal, color: 'text-slate-500', bg: 'bg-slate-100' },
                    { text: '12000 عملية كشف حقائق (AI)', icon: FaRobot, color: 'text-indigo-800', bg: 'bg-indigo-50' },
                    { text: '365 يوم إعلانات ممولة', icon: FaAd, color: 'text-green-800', bg: 'bg-green-50' },
                ];
            default:
                try {
                    const dbFeatures = typeof plan?.features === 'string' ? JSON.parse(plan.features) : (plan?.features || []);
                    return dbFeatures.map(f => ({ text: f, icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-50' }));
                } catch (e) {
                    return [];
                }
        }
    };

    const currentFeatures = getPlanFeatures(plan?.slug || 'free');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ar-EG');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FaCreditCard className="text-purple-600" /> تفاصيل الاشتراك الحالي
                    </h3>
                    {isFree ? (
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 pointer-events-none">باقة مجانية</Badge>
                    ) : (
                        <Badge className={`${subscription?.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'} hover:bg-opacity-80 pointer-events-none`}>
                            {subscription?.status === 'active' ? 'نشط' : 'منتهي/ملغي'}
                        </Badge>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg transition-transform hover:scale-105 duration-300
                            ${isFree ? 'bg-gray-100 text-gray-400' :
                              plan?.slug?.includes('annual') ? 'bg-gradient-to-br from-slate-800 to-black text-yellow-400 border-4 border-yellow-400' :
                              'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'}`}>
                            <FaCrown />
                        </div>

                        <div className="flex-1 text-center md:text-right space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">
                                {plan?.name || 'الباقة المجانية'}
                            </h2>
                            <p className="text-gray-500 font-medium text-lg">
                                {isFree
                                    ? 'أنت تستخدم المميزات الأساسية المجانية.'
                                    : plan?.slug?.includes('annual')
                                        ? 'أفضل توفير 💎 - اشتراك سنوي مميز VIP.'
                                        : 'اشتراك شهري يمنحك مميزات احترافية.'}
                            </p>

                            {!isFree && subscription && (
                                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                                        <FaCalendarAlt className="text-brand-blue" />
                                        <span>البدء: <span dir="ltr" className="font-mono">{formatDate(subscription.start_at || subscription.created_at)}</span></span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border ${subscription.status
                                       === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        <FaCalendarCheck />
                                        <span>
                                            {subscription.status === 'active'
                                                ? `يتجدد: ${formatDate(subscription.ends_at) || 'تلقائي'}`
                                                : `انتهى: ${formatDate(subscription.ends_at)}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                            {isFree ? (
                                <Link href={route('plans.index')} className="w-full">
                                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600
                                    hover:to-orange-700 text-white font-black w-full shadow-xl border-0 h-12 text-lg transform transition hover:-translate-y-1">
                                        <FaCrown className="ml-2" /> ترقية الباقة الآن
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('plans.index')} className="w-full">
                                    <Button variant="outline" className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 h-11 font-bold">
                                        تغيير الخطة
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <h4 className="font-black text-blue-900 mb-6 flex items-center gap-2 text-xl">
                        <FaStar className="text-yellow-500" /> مميزات باقتك الحالية
                    </h4>
                    {currentFeatures.length > 0 ? (
                        <div className="grid gap-3">
                            {currentFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-blue-100/50
                                shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`p-3 rounded-full ${feature.bg} ${feature.color}`}>
                                        <feature.icon size={18} />
                                    </div>
                                    <span className="text-base font-bold text-gray-700">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-blue-800/60 text-center py-4">جاري تحميل المميزات...</p>
                    )}
                </div>

                {subscription_history && subscription_history.length > 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                            <FaHistory className="text-gray-400" /> سجل الاشتراكات السابق
                        </h4>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2 max-h-[400px]">
                            {subscription_history.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                                border border-gray-100 hover:bg-gray-100 transition-colors group">
                                    <div>
                                        <p className="font-bold text-base text-gray-800 group-hover:text-brand-blue transition-colors">
                                            {sub.plan?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1">
                                            <FaCalendarAlt size={10} />
                                            {formatDate(sub.start_at || sub.created_at)}
                                            <span className="mx-1">-></span>
                                            {formatDate(sub.ends_at)}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="bg-gray-200 text-gray-600 border-0 px-3">
                                        منتهي
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center
                    justify-center text-center text-gray-400 h-full min-h-[300px]">
                        <FaHistory size={40} className="mb-4 opacity-50" />
                        <p className="font-medium">لا يوجد سجل اشتراكات سابق</p>
                    </div>
                )}
            </div>
        </div>
    );
}
