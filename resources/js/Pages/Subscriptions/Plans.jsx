import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';

export default function Plans({ plans, currentSubscription }) {
    const { post, processing } = useForm();

    const handleSubscribe = (planSlug) => {
        post(route('payment.subscribe', planSlug));
    };

    const getPlanIcon = (slug) => {
        switch (slug) {
            case 'free':
                return <Sparkles className="h-8 w-8 text-gray-400" />;
            case 'basic':
                return <Zap className="h-8 w-8 text-blue-500" />;
            case 'premium':
            case 'pro':
                return <Crown className="h-8 w-8 text-yellow-500" />;
            default:
                return <Sparkles className="h-8 w-8 text-indigo-500" />;
        }
    };

    const getPlanGradient = (slug) => {
        switch (slug) {
            case 'free':
                return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900';
            case 'basic':
                return 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20';
            case 'premium':
            case 'pro':
                return 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20';
            default:
                return 'from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20';
        }
    };

    const isCurrentPlan = (plan) => {
        return currentSubscription?.plan?.id === plan.id;
    };

    const formatFeatureLabel = (key) => {
        const labels = {
            max_ads: 'الحد الأقصى للإعلانات',
            max_categories: 'الحد الأقصى للفئات',
            featured_ads: 'الإعلانات المميزة',
            priority_support: 'الدعم المتميز',
            analytics: 'التحليلات',
        };
        return labels[key] || key.replace(/_/g, ' ');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    اختر خطتك
                </h2>
            }
        >
            <Head title="الخطط والأسعار" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Current Subscription Badge */}
                    {currentSubscription && (
                        <div className="mb-8 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                            <p className="text-center text-sm text-indigo-700 dark:text-indigo-300">
                                أنت مشترك حالياً في خطة{' '}
                                <span className="font-bold">
                                    {currentSubscription.plan?.name}
                                </span>
                                {currentSubscription.ends_at && (
                                    <span>
                                        {' '}حتى{' '}
                                        {new Date(currentSubscription.ends_at).toLocaleDateString('ar-EG')}
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Plans Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getPlanGradient(plan.slug)} p-8 shadow-lg transition-all hover:shadow-xl ${isCurrentPlan(plan)
                                    ? 'ring-2 ring-indigo-500 ring-offset-2'
                                    : ''
                                    }`}
                            >
                                {/* Popular Badge */}
                                {plan.slug === 'basic' && (
                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                                            الأكثر شعبية
                                        </span>
                                    </div>
                                )}

                                {/* Current Plan Badge */}
                                {isCurrentPlan(plan) && (
                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                            خطتك الحالية
                                        </span>
                                    </div>
                                )}

                                {/* Plan Icon */}
                                <div className="mb-4">{getPlanIcon(plan.slug)}</div>

                                {/* Plan Name */}
                                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {plan.name}
                                </h3>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                        {plan.is_free ? 'مجاني' : `$${parseFloat(plan.price).toFixed(0)}`}
                                    </span>
                                    {!plan.is_free && (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            /{plan.billing_interval === 'yearly' ? 'سنوي' : 'شهري'}
                                        </span>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="mb-8 space-y-3">
                                    {plan.features &&
                                        Object.entries(plan.features).map(([key, value]) => (
                                            <li
                                                key={key}
                                                className="flex items-center text-gray-600 dark:text-gray-300"
                                            >
                                                <Check className="ml-2 h-5 w-5 text-green-500" />
                                                <span>
                                                    {formatFeatureLabel(key)}:{' '}
                                                    {value === true
                                                        ? '✓'
                                                        : value === false
                                                            ? '✗'
                                                            : value === null
                                                                ? 'غير محدود'
                                                                : value}
                                                </span>
                                            </li>
                                        ))}
                                </ul>

                                {/* CTA Button */}
                                {isCurrentPlan(plan) ? (
                                    <button
                                        disabled
                                        className="w-full rounded-lg bg-gray-300 px-6 py-3 text-center font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                    >
                                        خطتك الحالية
                                    </button>
                                ) : plan.is_free ? (
                                    <button
                                        disabled
                                        className="w-full rounded-lg bg-gray-200 px-6 py-3 text-center font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        مجاني للأبد
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSubscribe(plan.slug)}
                                        disabled={processing}
                                        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-center font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'جاري المعالجة...' : 'اشترك الآن'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
                        <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            مدفوعات آمنة مع Stripe
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            جميع المدفوعات تتم بشكل آمن عبر Stripe. معلومات الدفع الخاصة بك لا يتم تخزينها على خوادمنا.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
