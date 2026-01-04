import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaCrown, FaCheckCircle, FaCalendarAlt, FaCreditCard, FaStar } from 'react-icons/fa';

export default function SubscriptionTab({ subscription, plan }) {
    const isFree = !subscription || plan?.slug === 'free';

    let featuresList = [];
    try {
        if (Array.isArray(plan?.features)) {
            featuresList = plan.features;
        } else if (typeof plan?.features === 'string') {
            featuresList = JSON.parse(plan.features);
        }
    } catch (e) {
        featuresList = [];
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FaCreditCard className="text-purple-600" /> تفاصيل الاشتراك
                    </h3>
                    {isFree ? (
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">باقة مجانية</Badge>
                    ) : (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            {subscription.status === 'active' ? 'نشط' : 'منتهي/ملغي'}
                        </Badge>
                    )}
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg
                            ${isFree ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'}`}>
                            <FaCrown />
                        </div>

                        <div className="flex-1 text-center md:text-right space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">
                                {plan?.name || 'الباقة الأساسية'}
                            </h2>
                            <p className="text-gray-500">
                                {isFree
                                    ? 'أنت تستمتع حالياً بالمميزات الأساسية للعضوية.'
                                    : 'أنت تستمتع بمميزات العضوية المميزة.'}
                            </p>

                            {!isFree && subscription && (
                                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <FaCalendarAlt className="text-brand-blue" />
                                        <span>تاريخ البدء: {new Date(subscription.created_at).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>ينتهي في: {subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString('ar-EG') : 'تجديد تلقائي'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {isFree ? (
                                <Link href={route('plans.index')}>
                                    <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold w-full shadow-lg border-0">
                                        <FaCrown className="ml-2" /> ترقية الباقة الآن
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('plans.index')}>
                                    <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                                        تغيير الخطة
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <FaStar className="text-yellow-500" /> مميزات باقتك الحالية
                    </h4>

                    {featuresList.length > 0 ? (
                        <ul className="space-y-3">
                            {featuresList.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-blue-800 font-medium">
                                    <FaCheckCircle className="text-green-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-blue-800/60">لا توجد مميزات إضافية مدرجة لهذه الباقة.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
