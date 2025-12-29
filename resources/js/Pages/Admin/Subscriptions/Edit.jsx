import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ subscription, plans }) {
    const { data, setData, put, processing, errors } = useForm({
        status: subscription.status || 'active',
        plan_id: subscription.plan_id ? Number(subscription.plan_id) : '',
        ends_at: subscription.ends_at ? subscription.ends_at.split('T')[0] : '',
        auto_renew: subscription.auto_renew ?? true,
        admin_notes: subscription.admin_notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.subscriptions.update', subscription.id));
    };

    const formatDate = (date) => {
        if (!date) return 'غير محدد';
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const statusOptions = [
        { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'ملغى', color: 'bg-red-100 text-red-800' },
        { value: 'expired', label: 'منتهي', color: 'bg-gray-100 text-gray-800' },
        { value: 'past_due', label: 'متأخر', color: 'bg-yellow-100 text-yellow-800' },
    ];

    return (
        <>
            <Head title="تعديل الاشتراك" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">تعديل الاشتراك</h1>
                    <Link
                        href={route('admin.subscriptions.index')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        العودة للقائمة
                    </Link>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات المستخدم</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">الاسم</span>
                            <p className="font-medium">{subscription.user?.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">البريد الإلكتروني</span>
                            <p className="font-medium">{subscription.user?.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">تاريخ البدء</span>
                            <p className="font-medium">{formatDate(subscription.start_at)}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">الخطة الحالية</span>
                            <p className="font-medium">{subscription.plan?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الحالة
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {statusOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition ${data.status === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={option.value}
                                            checked={data.status === option.value}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        {/* Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الخطة
                            </label>
                            <select
                                value={data.plan_id}
                                onChange={(e) => setData('plan_id', e.target.value ? Number(e.target.value) : '')}
                                disabled={!plans || plans.length === 0}
                                className={`w-full rounded-lg shadow-sm focus:ring-blue-500 ${errors.plan_id
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } ${!plans || plans.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                {(!plans || plans.length === 0) ? (
                                    <option value="">لا توجد خطط متاحة</option>
                                ) : (
                                    <>
                                        {!data.plan_id && (
                                            <option value="">اختر خطة...</option>
                                        )}
                                        {plans.map((plan) => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price}
                                                {!plan.is_active ? ' (غير نشطة)' : ''}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            {errors.plan_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.plan_id}</p>
                            )}
                            {(!plans || plans.length === 0) && (
                                <p className="mt-1 text-sm text-yellow-600">
                                    لا توجد خطط نشطة. يرجى تفعيل خطة واحدة على الأقل.
                                </p>
                            )}
                        </div>

                        {/* Ends At */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                تاريخ الانتهاء
                            </label>
                            <input
                                type="date"
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                                className={`w-full rounded-lg shadow-sm focus:ring-blue-500 ${errors.ends_at
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                            <p className="mt-1 text-xs text-gray-500">اتركه فارغاً للاشتراك غير المحدود</p>
                            {errors.ends_at && (
                                <p className="mt-1 text-sm text-red-600">{errors.ends_at}</p>
                            )}
                        </div>

                        {/* Auto Renew */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.auto_renew}
                                    onChange={(e) => setData('auto_renew', e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-700">التجديد التلقائي</span>
                                    <p className="text-xs text-gray-500">تجديد الاشتراك تلقائياً عند انتهائه</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ملاحظات الإدارة
                        </label>
                        <textarea
                            value={data.admin_notes}
                            onChange={(e) => setData('admin_notes', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="ملاحظات داخلية للإدارة فقط..."
                        />
                        {errors.admin_notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.admin_notes}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link
                            href={route('admin.subscriptions.index')}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            إلغاء
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <AdminLayout children={page} />;
