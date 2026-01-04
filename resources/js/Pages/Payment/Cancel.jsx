import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { XCircle, ArrowRight } from 'lucide-react';

export default function Cancel({ plans }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    تم إلغاء الدفع
                </h2>
            }
        >
            <Head title="تم إلغاء الدفع" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                            </div>

                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                تم إلغاء الدفع
                            </h3>

                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت.
                            </p>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('plans.index')}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    العودة للخطط
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    تصفح الموقع
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Show other plans */}
                    {plans && plans.length > 0 && (
                        <div className="mt-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                            <h4 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
                                الخطط المتاحة
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="rounded-lg bg-white p-4 shadow dark:bg-gray-700"
                                    >
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {plan.name}
                                        </h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {plan.is_free ? 'مجاني' : `$${plan.price}/${plan.billing_interval === 'yearly' ? 'سنوي' : 'شهري'}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
