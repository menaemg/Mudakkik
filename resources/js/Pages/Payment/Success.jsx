import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Success({ subscription, processing, message }) {
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

    // Processing state
    if (processing && !subscription) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Processing Payment
                    </h2>
                }
            >
                <Head title="Processing Payment" />

                <div className="py-12">
                    <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-8 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                    <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                </div>

                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    جاري معالجة الدفع...
                                </h3>

                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    {message || 'يرجى الانتظار بينما نقوم بتفعيل اشتراكك.'}
                                </p>

                                <p className="text-sm text-gray-500">
                                    سيتم التحديث تلقائياً
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Success state
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Payment Successful
                </h2>
            }
        >
            <Head title="Payment Successful" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>

                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                تم الدفع بنجاح!
                            </h3>

                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                شكراً لاشتراكك. تم معالجة الدفع بنجاح.
                            </p>

                            {subscription && (
                                <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        الخطة الحالية
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {subscription.plan?.name}
                                    </p>
                                    {subscription.ends_at && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            صالح حتى {new Date(subscription.ends_at).toLocaleDateString('ar-EG')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    تصفح الموقع
                                </Link>
                                <Link
                                    href={route('plans.index')}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    عرض الخطط
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
