import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CreditCard, User, Calendar, DollarSign, FileText } from 'lucide-react';

export default function Show({ payment }) {
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800',
        };
        const labels = {
            pending: 'قيد الانتظار',
            completed: 'مكتمل',
            failed: 'فشل',
            refunded: 'مسترد',
        };
        return (
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <>
            <Head title={`الدفعة #${payment.id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.payments.index')}
                        className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-500 p-2">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">الدفعة #{payment.id}</h1>
                    </div>
                    <div className="mr-auto">{getStatusBadge(payment.status)}</div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Payment Details */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            تفاصيل الدفعة
                        </h2>
                        <dl className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">المبلغ</dt>
                                <dd className="font-semibold text-gray-900">
                                    {formatCurrency(payment.amount, payment.currency)}
                                </dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">العملة</dt>
                                <dd className="font-medium text-gray-900">{payment.currency}</dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">طريقة الدفع</dt>
                                <dd className="font-medium text-gray-900">{payment.payment_method}</dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">المزود</dt>
                                <dd className="font-medium text-gray-900">{payment.provider}</dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">معرف المعاملة</dt>
                                <dd className="font-mono text-sm text-gray-900">
                                    {payment.transaction_id || '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <dt className="text-gray-500">معرف المزود</dt>
                                <dd className="font-mono text-sm text-gray-900">
                                    {payment.provider_payment_id || '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">التاريخ</dt>
                                <dd className="text-gray-900">{formatDate(payment.created_at)}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* User & Subscription */}
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <User className="h-5 w-5 text-blue-500" />
                                المستخدم
                            </h2>
                            {payment.user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                                        <span className="text-lg font-semibold text-indigo-600">
                                            {payment.user.name?.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{payment.user.name}</p>
                                        <p className="text-sm text-gray-500">{payment.user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">مستخدم محذوف</p>
                            )}
                        </div>

                        {/* Subscription Info */}
                        {payment.subscription && (
                            <div className="rounded-lg bg-white p-6 shadow">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Calendar className="h-5 w-5 text-purple-500" />
                                    الاشتراك
                                </h2>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">الخطة</dt>
                                        <dd className="font-medium text-gray-900">
                                            {payment.subscription.plan?.name || '-'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">الحالة</dt>
                                        <dd className="font-medium text-gray-900">
                                            {payment.subscription.status}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                </div>

                {/* Failure Reason */}
                {payment.failure_reason && (
                    <div className="rounded-lg bg-red-50 p-6 shadow">
                        <h2 className="mb-2 text-lg font-semibold text-red-800">سبب الفشل</h2>
                        <p className="text-red-700">{payment.failure_reason}</p>
                    </div>
                )}
            </div>
        </>
    );
}

Show.layout = (page) => <AdminLayout children={page} />;
