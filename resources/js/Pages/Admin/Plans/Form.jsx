import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ plan }) {
    const isEditing = !!plan;

    const { data, setData, post, put, processing, errors } = useForm({
        name: plan?.name || '',
        price: plan?.price || 0,
        billing_interval: plan?.billing_interval || 'monthly',
        duration_days: plan?.duration_days || 30,
        is_free: plan?.is_free || false,
        is_active: plan?.is_active ?? true,
        sort_order: plan?.sort_order || 0,
        features: plan?.features || {
            posts_limit: 10,
            ads_limit: 0,
            priority_support: false,
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.plans.update', plan.slug));
        } else {
            post(route('admin.plans.store'));
        }
    };

    return (
        <>
            <Head title={isEditing ? 'تعديل الخطة' : 'إضافة خطة جديدة'} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? `تعديل: ${plan.name}` : 'إضافة خطة جديدة'}
                    </h1>
                    <Link
                        href={route('admin.plans.index')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        العودة للقائمة
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                اسم الخطة
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                السعر ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>

                        {/* Billing Interval */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                فترة الدفع
                            </label>
                            <select
                                value={data.billing_interval}
                                onChange={(e) => setData('billing_interval', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="monthly">شهري</option>
                                <option value="yearly">سنوي</option>
                                <option value="one_time">مرة واحدة</option>
                            </select>
                        </div>

                        {/* Duration Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                مدة الاشتراك (بالأيام)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={data.duration_days || ''}
                                onChange={(e) => setData('duration_days', e.target.value ? parseInt(e.target.value) : null)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="اتركه فارغاً للمدة غير المحدودة"
                            />
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                ترتيب العرض
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-8">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_free}
                                onChange={(e) => setData('is_free', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">خطة مجانية</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">نشط</span>
                        </label>
                    </div>

                    {/* Features */}
                    <div className="border-t pt-6">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">الميزات</h3>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    حد المنشورات
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.features.posts_limit ?? ''}
                                    onChange={(e) =>
                                        setData('features', {
                                            ...data.features,
                                            posts_limit: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="فارغ = غير محدود"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    عدد الإعلانات
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.features.ads_limit ?? ''}
                                    onChange={(e) =>
                                        setData('features', {
                                            ...data.features,
                                            ads_limit: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="فارغ = غير محدود"
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.features.priority_support || false}
                                    onChange={(e) =>
                                        setData('features', {
                                            ...data.features,
                                            priority_support: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">دعم أولوية</span>
                            </label>
                        </div>

                        {/* Custom Features */}
                        <div className="mt-6 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">ميزات إضافية</h4>

                            {/* Existing custom features */}
                            <div className="space-y-2 mb-4">
                                {Object.entries(data.features)
                                    .filter(([key]) => !['posts_limit', 'ads_limit', 'priority_support'].includes(key))
                                    .map(([key, feature]) => (
                                        <div key={key} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <div>
                                                    <span className="block text-xs text-gray-500">المفتاح</span>
                                                    <span className="text-sm font-medium text-gray-700">{key}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-500">الاسم بالعربي</span>
                                                    <input
                                                        type="text"
                                                        value={feature?.label_ar ?? ''}
                                                        onChange={(e) =>
                                                            setData('features', {
                                                                ...data.features,
                                                                [key]: {
                                                                    label_ar: e.target.value,
                                                                    value: feature?.value ?? ''
                                                                },
                                                            })
                                                        }
                                                        className="w-full rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-500">القيمة</span>
                                                    <input
                                                        type="text"
                                                        value={feature?.value ?? ''}
                                                        onChange={(e) =>
                                                            setData('features', {
                                                                ...data.features,
                                                                [key]: {
                                                                    label_ar: feature?.label_ar ?? '',
                                                                    value: e.target.value
                                                                },
                                                            })
                                                        }
                                                        className="w-full rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFeatures = { ...data.features };
                                                    delete newFeatures[key];
                                                    setData('features', newFeatures);
                                                }}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="حذف"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Add new feature form */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-600 mb-2">إضافة ميزة جديدة</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">المفتاح (إنجليزي)</label>
                                        <input
                                            type="text"
                                            id="new-feature-key"
                                            className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="storage_limit"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">الاسم بالعربي</label>
                                        <input
                                            type="text"
                                            id="new-feature-label-ar"
                                            className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="حد التخزين"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">القيمة</label>
                                        <input
                                            type="text"
                                            id="new-feature-value"
                                            className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="10GB"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const keyInput = document.getElementById('new-feature-key');
                                        const labelArInput = document.getElementById('new-feature-label-ar');
                                        const valueInput = document.getElementById('new-feature-value');
                                        const key = keyInput.value.trim();
                                        const labelAr = labelArInput.value.trim();
                                        const value = valueInput.value.trim();
                                        if (key && !data.features[key]) {
                                            setData('features', {
                                                ...data.features,
                                                [key]: { label_ar: labelAr, value: value },
                                            });
                                            keyInput.value = '';
                                            labelArInput.value = '';
                                            valueInput.value = '';
                                        }
                                    }}
                                    className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                                >
                                    + إضافة ميزة
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href={route('admin.plans.index')}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            إلغاء
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'جاري الحفظ...' : isEditing ? 'تحديث الخطة' : 'إنشاء الخطة'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Form.layout = (page) => <AdminLayout children={page} />;
