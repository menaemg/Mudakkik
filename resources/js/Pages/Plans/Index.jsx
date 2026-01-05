import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Check, Star, Zap, Crown } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function PlansIndex({ auth, plans, currentSubscription }) {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const { post, processing } = useForm();
  const [processingPlan, setProcessingPlan] = useState(null);
  const isGuest = !auth?.user;

  const handleSubscribe = (planSlug) => {
    if (isGuest) {
      router.visit(route('login'));
      return;
    }
    setProcessingPlan(planSlug);
    post(route('payment.subscribe', planSlug), {
      onFinish: () => setProcessingPlan(null),
    });
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
    if (slug.includes("pro")) return <Crown className="text-purple-500" size={32} />;
    return <Star className="text-gray-500" size={32} />;
  };

  const getFeatureDisplay = (features) => {
    return [
      features.posts_limit === null ? "منشورات غير محدودة" : `${features.posts_limit} منشور`,
      features.ads_limit === null ? "إعلانات غير محدودة" : features.ads_limit === 0 ? "بدون إعلانات" : `${features.ads_limit} إعلان`,
      features.priority_support ? "دعم فني ذو أولوية" : "دعم فني أساسي",
    ];
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
      <Head title="الباقات والاشتراكات" />

      <Header auth={auth} />

      <main className="flex-grow pt-[130px] pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {currentSubscription && (
            <div className="mb-12 rounded-2xl bg-indigo-50/80 backdrop-blur-sm p-4 border border-indigo-100 flex justify-center" data-aos="fade-down">
              <p className="text-center text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Crown size={16} />
                أنت مشترك حالياً في خطة <span className="text-brand-blue font-black text-base mx-1">{currentSubscription.plan?.name}</span>
                {currentSubscription.ends_at && (
                  <span className="text-indigo-600 font-normal">
                    (ينتهي في {new Date(currentSubscription.ends_at).toLocaleDateString('ar-EG')})
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="text-center mb-16 space-y-4" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
              استثمر في <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-purple-600">نجاحك</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              اختر الباقة المثالية التي تناسب احتياجاتك الصحفية وانضم لنخبة الكتاب في منصة مدقق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {plans.map((plan, index) => {
              const isPopular = plan.slug === "pro";
              const isCurrent = isCurrentPlan(plan);
              const features = getFeatureDisplay(plan.features);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 group
                    ${isPopular ? "shadow-2xl shadow-purple-200 ring-2 ring-purple-500 transform lg:-translate-y-4 z-10" : "shadow-xl border border-slate-100 hover:-translate-y-2"}
                    ${isCurrent ? "ring-2 ring-green-500 bg-green-50/30" : ""}
                  `}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {isCurrent && (
                    <div className="bg-green-500 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">
                      مشترك حالياً
                    </div>
                  )}
                  {isPopular && !isCurrent && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">
                      الأكثر مبيعاً
                    </div>
                  )}

                  <div className="p-8">
                    <div className="mb-6 flex justify-center p-4 bg-slate-50 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform">
                      {getPlanIcon(plan.slug)}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">{plan.name}</h3>

                    <div className="text-center mb-8 pb-8 border-b border-gray-100">
                      <div className="flex items-baseline justify-center gap-1">
                        {plan.is_free ? (
                          <span className="text-4xl font-black text-gray-900">مجاني</span>
                        ) : (
                          <>
                            <span className="text-4xl font-black text-gray-900">{Math.floor(plan.price)}</span>
                            <span className="text-sm font-bold text-gray-500">ج.م</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-1">
                        {getBillingText(plan.billing_interval)}
                      </p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                          <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <Check size={10} strokeWidth={4} />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-green-100 text-green-700 cursor-default">
                        تم الاشتراك
                      </button>
                    ) : plan.is_free ? (
                      <button
                        onClick={() => isGuest && router.visit(route('register'))}
                        disabled={!isGuest}
                        className="w-full py-4 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isGuest ? 'سجل مجاناً' : 'مفعل افتراضياً'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.slug)}
                        disabled={processingPlan !== null}
                        className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                          ${isPopular ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-200" : "bg-gray-900 hover:bg-black shadow-gray-200"}
                        `}
                      >
                        {processingPlan === plan.slug ? "جاري التحويل..." : "اشترك الآن"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 text-center border-t border-gray-200 pt-10" data-aos="fade-up">
            <p className="text-gray-500 font-medium">
              هل تحتاج لمساعدة في اختيار الباقة؟{" "}
              <a href="#" className="text-brand-blue font-bold hover:underline decoration-2 underline-offset-4">
                تحدث مع فريق المبيعات
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
