import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Check, Star, Zap, Crown } from "lucide-react";

export default function PlansIndex({ auth, plans, currentSubscription }) {
  const { post, processing } = useForm();
  const isGuest = !auth?.user;

  const handleSubscribe = (planSlug) => {
    if (isGuest) {
      router.visit(route('login'));
      return;
    }
    post(route('payment.subscribe', planSlug));
  };

  const isCurrentPlan = (plan) => {
    return currentSubscription?.plan?.id === plan.id;
  };

  const getBillingText = (interval) => {
    const texts = {
      monthly: "شهرياً",
      yearly: "سنوياً",
      one_time: "دفعة واحدة",
    };
    return texts[interval] || interval;
  };

  const getPlanIcon = (slug) => {
    if (slug === "free") return <Star className="text-yellow-500" size={32} />;
    if (slug === "basic") return <Zap className="text-blue-500" size={32} />;
    if (slug.includes("pro"))
      return <Crown className="text-purple-500" size={32} />;
    return <Star className="text-gray-500" size={32} />;
  };

  const getFeatureDisplay = (features) => {
    return [
      features.posts_limit === null
        ? "منشورات غير محدودة"
        : `${features.posts_limit} منشور`,
      features.ads_limit === null
        ? "إعلانات غير محدودة"
        : features.ads_limit === 0
          ? "بدون إعلانات"
          : `${features.ads_limit} إعلان`,
      features.priority_support ? "دعم فني ذو أولوية" : "دعم فني أساسي",
    ];
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="الباقات" />

      <div className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Current Subscription Badge */}
          {currentSubscription && (
            <div className="mb-8 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
              <p className="text-center text-sm text-indigo-700">
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

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              اختر الباقة المناسبة لك
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              انضم إلى منصة مدقق واختر الباقة التي تناسب احتياجاتك
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const isPopular = plan.slug === "pro";
              const isCurrent = isCurrentPlan(plan);
              const features = getFeatureDisplay(plan.features);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isPopular ? "ring-4 ring-purple-500 lg:scale-105" : ""
                    } ${isCurrent ? "ring-4 ring-green-500" : ""}`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Current Plan Badge */}
                  {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-sm font-bold">
                      ✓ خطتك الحالية
                    </div>
                  )}

                  {/* Popular Badge */}
                  {isPopular && !isCurrent && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                      ⭐ الأكثر شعبية
                    </div>
                  )}

                  <div className={`p-8 ${(isPopular || isCurrent) ? "pt-14" : ""}`}>
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      {getPlanIcon(plan.slug)}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2">
                        {plan.is_free ? (
                          <span className="text-5xl font-bold text-green-600">
                            مجاني
                          </span>
                        ) : (
                          <>
                            <span className="text-5xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <span className="text-gray-600">جنيه</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {getBillingText(plan.billing_interval)}
                      </p>
                      {plan.duration_days && (
                        <p className="text-xs text-gray-400 mt-1">
                          ({plan.duration_days} يوم)
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check
                            className="text-green-500 flex-shrink-0 mt-1"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        خطتك الحالية
                      </button>
                    ) : plan.is_free ? (
                      isGuest ? (
                        <button
                          onClick={() => router.visit(route('register'))}
                          className="w-full py-4 rounded-xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition-all transform hover:scale-105"
                        >
                          ابدأ الآن
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-600 cursor-not-allowed"
                        >
                          مجاني للأبد
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.slug)}
                        disabled={processing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isPopular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                      >
                        {processing ? "جاري المعالجة..." : "اشترك الآن"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              هل لديك أسئلة؟{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                تواصل معنا
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
