import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Crown, Calendar, CreditCard, ArrowRight } from 'lucide-react';

export default function Show({ subscription, history }) {
    const formatDate = (date) => {
        if (!date) return 'غير محدد';
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            expired: 'bg-gray-100 text-gray-800',
            past_due: 'bg-yellow-100 text-yellow-800',
        };
        const labels = {
            active: 'نشط',
            cancelled: 'ملغى',
            expired: 'منتهي',
            past_due: 'متأخر',
        };
        return (
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    اشتراكي
                </h2>
            }
        >
            <Head title="اشتراكي" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Current Subscription */}
                    {subscription ? (
                        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-white/20 p-3">
                                            <Crown className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">
                                                {subscription.plan?.name}
                                            </h3>
                                            <p className="text-indigo-100">خطتك الحالية</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(subscription.status)}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(subscription.start_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الانتهاء</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {subscription.ends_at ? formatDate(subscription.ends_at) : 'غير محدود'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">التجديد التلقائي</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {subscription.auto_renew ? 'مفعل' : 'معطل'}
                                            </p>
                                        </div>
                                    </div>

                                    {subscription.provider && (
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">المزود</p>
                                                <p className="font-medium capitalize text-gray-900 dark:text-white">
                                                    {subscription.provider}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Link
                                        href={route('plans.index')}
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                        ترقية الخطة
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                            <Crown className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                لا يوجد اشتراك نشط
                            </h3>
                            <p className="mb-4 text-gray-500 dark:text-gray-400">
                                قم بالاشتراك في خطة للاستفادة من جميع المميزات
                            </p>
                            <Link
                                href={route('plans.index')}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                عرض الخطط
                            </Link>
                        </div>
                    )}

                    {/* Subscription History */}
                    {history && history.length > 0 && (
                        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    سجل الاشتراكات
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {history.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {sub.plan?.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(sub.start_at)}
                                            </p>
                                        </div>
                                        {getStatusBadge(sub.status)}
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
