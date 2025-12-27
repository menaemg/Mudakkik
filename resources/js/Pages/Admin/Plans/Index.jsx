import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ plans }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getBillingLabel = (interval) => {
        const labels = {
            monthly: 'شهري',
            yearly: 'سنوي',
            one_time: 'مرة واحدة',
        };
        return labels[interval] || interval;
    };

    const handleDelete = (plan) => {
        if (confirm(`هل أنت متأكد من حذف الخطة "${plan.name}"؟`)) {
            router.delete(route('admin.plans.destroy', plan.slug));
        }
    };

    return (
        <>
            <Head title="إدارة الخطط" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الخطط</h1>
                    <Link
                        href={route('admin.plans.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        إضافة خطة جديدة
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الترتيب
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الاسم
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    السعر
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الفترة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                        {plan.sort_order}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {plan.name}
                                            </span>
                                            {plan.is_free && (
                                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                                    مجاني
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">{plan.slug}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                                        {formatPrice(plan.price)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                        {getBillingLabel(plan.billing_interval)}
                                        {plan.duration_days && (
                                            <span className="text-xs"> ({plan.duration_days} يوم)</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${plan.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {plan.is_active ? 'نشط' : 'معطل'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('admin.plans.edit', plan.slug)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                تعديل
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(plan)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
