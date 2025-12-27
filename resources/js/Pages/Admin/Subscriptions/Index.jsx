import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ subscriptions, plans, filters }) {
    const formatDate = (date) => {
        if (!date) return 'غير محدد';
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
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
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.subscriptions.index'), {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="إدارة الاشتراكات" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الاشتراكات</h1>
                </div>

                {/* Filters */}
                <div className="flex gap-4 rounded-lg bg-white p-4 shadow">
                    <select
                        value={filters?.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm"
                    >
                        <option value="">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="cancelled">ملغى</option>
                        <option value="expired">منتهي</option>
                        <option value="past_due">متأخر</option>
                    </select>
                    <select
                        value={filters?.plan_id || ''}
                        onChange={(e) => handleFilter('plan_id', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm"
                    >
                        <option value="">جميع الخطط</option>
                        {plans?.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    المستخدم
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الخطة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    تاريخ البدء
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    تاريخ الانتهاء
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    تجديد تلقائي
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {subscriptions.data.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-medium text-gray-900">{sub.user?.name}</div>
                                        <div className="text-sm text-gray-500">{sub.user?.email}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="font-medium text-gray-900">{sub.plan?.name}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                        {formatDate(sub.start_at)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                        {sub.ends_at ? formatDate(sub.ends_at) : 'غير محدود'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(sub.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={sub.auto_renew ? 'text-green-600' : 'text-gray-400'}>
                                            {sub.auto_renew ? 'مفعل' : 'معطل'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Link
                                            href={route('admin.subscriptions.edit', sub.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            تعديل
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {subscriptions.links && (
                        <div className="flex justify-center gap-2 border-t border-gray-200 px-6 py-4">
                            {subscriptions.links.map((link, index) => {
                                // Safely decode HTML entities
                                const decodeLabel = (label) => {
                                    const entities = { '&laquo;': '«', '&raquo;': '»', '&amp;': '&' };
                                    return label.replace(/&[a-z]+;/gi, (m) => entities[m] || m);
                                };
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded px-3 py-1 text-sm ${link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {decodeLabel(link.label)}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
