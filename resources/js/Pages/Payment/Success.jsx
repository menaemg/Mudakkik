import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function Success({ auth, subscription, processing, message }) {
    // If processing, poll every 2 seconds to check for subscription
    useEffect(() => {
        if (processing && !subscription) {
            const interval = setInterval(() => {
                router.reload({ only: ['subscription', 'processing'] });
            }, 2000);

            // Stop after 30 seconds
            const timeout = setTimeout(() => {
                clearInterval(interval);
            }, 30000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [processing, subscription]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans" dir="rtl">
            <Head title={processing ? "جاري المعالجة" : "تم الدفع بنجاح"} />
            <Header auth={auth} />

            <main className="flex-grow flex flex-col justify-center py-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Processing State */}
                    {processing && !subscription ? (
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50"></div>

                            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                <Loader2 className="h-10 w-10 animate-spin" />
                            </div>

                            <h3 className="mb-4 text-3xl font-black text-[#020617]">
                                جاري معالجة الدفع...
                            </h3>

                            <p className="mb-8 text-gray-500 font-medium text-lg leading-relaxed">
                                {message || 'يرجى الانتظار بينما نقوم بتفعيل اشتراكك.'}
                            </p>

                            <p className="text-sm text-gray-400 font-bold">
                                لا تغلق الصفحة، سيتم التحديث تلقائياً...
                            </p>
                        </div>
                    ) : (
                        /* Success State */
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -z-10 opacity-50"></div>

                            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-sm">
                                <CheckCircle className="h-10 w-10" />
                            </div>

                            <h3 className="mb-4 text-3xl font-black text-[#020617]">
                                تم الدفع بنجاح!
                            </h3>

                            <p className="mb-8 text-gray-500 font-medium text-lg">
                                شكراً لاشتراكك. تم معالجة الدفع بنجاح وتفعيل حسابك.
                            </p>

                            {subscription && (
                                <div className="mb-8 rounded-2xl bg-gray-50 p-6 border border-gray-100 inline-block w-full max-w-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        الخطة الحالية
                                    </p>
                                    <p className="text-xl font-black text-[#020617] mb-1">
                                        {subscription.plan?.name}
                                    </p>
                                    {subscription.ends_at && (
                                        <p className="text-sm font-medium text-emerald-600">
                                            صالح حتى {new Date(subscription.ends_at).toLocaleDateString('ar-EG')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-xl bg-[#020617] px-8 py-4 text-sm font-bold text-white transition hover:bg-black hover:-translate-y-1 shadow-lg"
                                >
                                    تصفح الموقع
                                </Link>
                                <Link
                                    href={route('plans.index')}
                                    className="inline-flex items-center justify-center rounded-xl border-2 border-gray-100 bg-white px-8 py-4 text-sm font-bold text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                                >
                                    عرض الخطط
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
