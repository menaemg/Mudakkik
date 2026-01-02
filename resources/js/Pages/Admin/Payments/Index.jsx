import AdminLayout from '@/Layouts/AdminLayout';
import AdminPagination from '@/Layouts/AdminPagination';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, CreditCard, DollarSign } from 'lucide-react';

export default function Index({ payments, filters }) {
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
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
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getProviderBadge = (provider) => {
        const styles = {
            stripe: 'bg-indigo-100 text-indigo-800',
            paypal: 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[provider] || 'bg-gray-100 text-gray-800'}`}>
                {provider}
            </span>
        );
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.payments.index'), {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleFilter('search', formData.get('search'));
    };

    return (
        <>
            <Head title="إدارة المدفوعات" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-500 p-2">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">إدارة المدفوعات</h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                placeholder="بحث بالمستخدم..."
                                defaultValue={filters?.search || ''}
                                className="w-64 rounded-lg border-gray-300 pr-10 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            بحث
                        </button>
                    </form>

                    <select
                        value={filters?.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm"
                        aria-label="تصفية حسب الحالة"
                    >
                        <option value="">جميع الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="completed">مكتمل</option>
                        <option value="failed">فشل</option>
                        <option value="refunded">مسترد</option>
                    </select>

                    <select
                        value={filters?.provider || ''}
                        onChange={(e) => handleFilter('provider', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm"
                        aria-label="تصفية حسب المزود"
                    >
                        <option value="">جميع المزودين</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm text-gray-500">إجمالي المدفوعات</p>
                                <p className="text-xl font-bold text-gray-900">{payments.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    #
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    المستخدم
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    المبلغ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    المزود
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الاشتراك
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    التاريخ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {payments.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        <CreditCard className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                        <p>لا توجد مدفوعات حالياً</p>
                                    </td>
                                </tr>
                            ) : payments.data.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {payment.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {payment.user?.name || 'مستخدم محذوف'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {payment.user?.email || '-'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getProviderBadge(payment.provider)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {payment.subscription?.plan?.name || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {formatDate(payment.created_at)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Link
                                            href={route('admin.payments.show', payment.id)}
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Eye className="h-4 w-4" />
                                            عرض
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    links={payments.links}
                    total={payments.total}
                    label="إجمالي المدفوعات"
                />
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
