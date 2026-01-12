import React, { useState, useEffect } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Check, X, ShieldCheck, Gem, Crown, Zap, Star, Diamond, Headphones, RefreshCw } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import JoinJournalistModal from '@/Components/JoinJournalistModal';
import { FaPenNib, FaClock, FaCheckCircle } from "react-icons/fa";

export default function PlansIndex({ auth, plans, currentSubscription, upgradeRequestStatus, userRole }) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const { post, processing } = useForm();
    const [processingPlan, setProcessingPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isGuest = !auth?.user;
    const isJournalist = userRole === 'journalist';
    const isAdmin = userRole === 'admin';

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

    const isCurrentPlan = (plan) => currentSubscription?.plan?.id === plan.id;

    const getBillingText = (interval) => {
        const texts = { monthly: "شهرياً", yearly: "سنوياً", one_time: "دفعة واحدة" };
        return texts[interval] || interval;
    };

    const getPlanIcon = (slug) => {
        if (slug === "free") return <Star className="text-gray-400 w-8 h-8" />;
        if (slug === "basic") return <Zap className="text-orange-500 w-8 h-8" />;
        if (slug === "pro") return <Gem className="text-amber-500 w-10 h-10 drop-shadow-md" />;
        if (slug === "pro-yearly") return <Diamond className="text-cyan-500 w-10 h-10 drop-shadow-md" />;
        return <Star className="text-gray-500 w-8 h-8" />;
    };

    const getFeatureDisplay = (features) => {
        const list = [];


        if (features.priority_support) {
            list.push({ text: "دعم فني مباشر (Priority)", available: true, icon: <Headphones size={14} className="text-current" /> });
        } else {
            list.push({ text: "دعم فني قياسي", available: true });
        }


        if (features.verification_badge === 'platinum') {
            list.push({
                text: "شارة توثيق بلاتينية (VIP)",
                available: true,
                highlight: true,
                icon: <Diamond size={14} className="text-cyan-500 fill-cyan-500/20" />
            });
        } else if (features.verification_badge === 'gold') {
            list.push({
                text: "شارة توثيق ذهبية (Gold)",
                available: true,
                highlight: true,
                icon: <Gem size={14} className="text-amber-500 fill-amber-500/20" />
            });
        } else if (features.verification_badge === 'bronze') {
            list.push({ text: "شارة توثيق برونزية", available: true, icon: <ShieldCheck size={14} className="text-orange-500" /> });
        } else {
            list.push({ text: "بدون شارة توثيق", available: false });
        }

        if (features.monthly_ai_credits > 0) {
            list.push({ text: `${features.monthly_ai_credits} عملية كشف حقائق (AI)`, available: true });
        }

        if (features.monthly_ad_credits > 0) {
            list.push({ text: `${features.monthly_ad_credits} أيام إعلانات ممولة`, available: true });
        } else {
            list.push({ text: "لا يوجد رصيد إعلاني", available: false });
        }



        return list;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">
            <Head title="خطط الاشتراك" />
            <Header auth={auth} />

            <main className="flex-grow">

                <div className="relative pt-40 pb-36 md:pb-48 overflow-hidden bg-[#020617]">
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#b20e1e]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-300 text-sm font-bold mb-6 backdrop-blur-md shadow-lg" data-aos="fade-down">
                            <Crown className="w-4 h-4 animate-bounce" />
                            <span>عضويات النخبة</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl" data-aos="fade-up">
                            استثمر في <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">مصداقيتك</span>
                        </h1>

                        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium" data-aos="fade-up" data-aos-delay="100">
                            سواء كنت قارئاً يبحث عن الحقيقة أو صحفياً يريد التميز، باقاتنا تمنحك الأدوات والشارات التي تستحقها.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {currentSubscription && (
                        <div className="-mt-24 relative z-20 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl shadow-[#020617]/10 border border-white mb-12 flex flex-col md:flex-row items-center justify-between gap-4" data-aos="fade-up">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <Crown size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">باقتك الحالية</p>
                                    <h3 className="text-xl font-black text-[#020617]">{currentSubscription.plan?.name}</h3>
                                </div>
                            </div>
                            {currentSubscription.ends_at && (
                                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
                                    تتجدد في {new Date(currentSubscription.ends_at).toLocaleDateString('ar-EG')}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${currentSubscription ? '' : '-mt-20 relative z-20'}`}>
                        {plans.map((plan, index) => {
                            const isPro = plan.slug === 'pro';
                            const isPlatinum = plan.slug === 'pro-yearly';
                            const isCurrent = isCurrentPlan(plan);
                            const featuresList = getFeatureDisplay(plan.features);

                            let borderClass = 'border-gray-100';
                            let shadowClass = 'shadow-xl shadow-gray-200/50';
                            let bgIconClass = 'bg-gray-50 text-gray-500';
                            let buttonClass = 'bg-[#020617] hover:bg-black';
                            let ribbon = null;

                            if (isPro) {
                                borderClass = 'border-amber-400 scale-105 z-10';
                                shadowClass = 'shadow-2xl shadow-amber-500/20';
                                bgIconClass = 'bg-amber-50 text-amber-600';
                                buttonClass = 'bg-gradient-to-r from-amber-500 to-amber-700 hover:shadow-amber-500/30';
                                ribbon = <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest">الأكثر طلباً 🔥</div>;
                            } else if (isPlatinum) {
                                borderClass = 'border-cyan-400 scale-105 z-10';
                                shadowClass = 'shadow-2xl shadow-cyan-500/20';
                                bgIconClass = 'bg-cyan-50 text-cyan-600';
                                buttonClass = 'bg-gradient-to-r from-cyan-500 to-blue-700 hover:shadow-cyan-500/30';
                                ribbon = <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest">أفضل توفير 💎</div>;
                            }

                            if (isCurrent) borderClass = 'ring-4 ring-emerald-500/20 !border-emerald-500';

                            return (
                                <div
                                    key={plan.id}
                                    className={`group relative bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col border-2 ${borderClass} ${shadowClass}`}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    {ribbon}

                                    <div className="p-8 flex flex-col h-full">
                                        <div className="text-center mb-6">
                                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm ${bgIconClass}`}>
                                                {getPlanIcon(plan.slug)}
                                            </div>
                                            <h3 className="text-2xl font-black text-[#020617]">{plan.name}</h3>
                                        </div>

                                        <div className="text-center mb-8 pb-8 border-b border-gray-100">
                                            <div className="flex items-baseline justify-center gap-1 dir-ltr">
                                                {plan.is_free ? (
                                                    <span className="text-4xl font-black text-[#020617]">مجاني</span>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl font-bold text-gray-400">$</span>
                                                        <span className="text-5xl font-black text-[#020617]">{Math.floor(plan.price)}</span>
                                                        <span className="text-sm font-bold text-gray-400 mr-1">{getBillingText(plan.billing_interval)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {featuresList.map((feature, idx) => (
                                                <li key={idx} className={`flex items-start gap-3 text-sm font-bold ${feature.available ? 'text-gray-700' : 'text-gray-300'}`}>
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
                                                ${feature.available ? (feature.highlight ? (isPlatinum ? 'bg-cyan-100 text-cyan-600' : 'bg-amber-100 text-amber-600') : 'bg-emerald-100 text-emerald-600') : 'bg-gray-100 text-gray-300'}`}>
                                                        {feature.available ? (feature.icon || <Check size={12} strokeWidth={3} />) : <X size={12} strokeWidth={3} />}
                                                    </div>
                                                    <span className={feature.highlight ? "text-[#020617]" : ""}>{feature.text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto">
                                            {plan.is_free ? (
                                                <button
                                                    onClick={() => isGuest && router.visit(route('register'))}
                                                    disabled={!isGuest}
                                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-colors ${isCurrent
                                                        ? 'bg-emerald-100 text-emerald-700 flex items-center justify-center gap-2'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isGuest ? 'ابدا مجاناً' : isCurrent ? (<><Check size={16} /> الباقة الحالية</>) : 'غير متاح'}
                                                </button>
                                            ) : isCurrent ? (
                                                <button
                                                    onClick={() => handleSubscribe(plan.slug)}
                                                    disabled={processingPlan !== null}
                                                    className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30
                                                ${processingPlan !== null ? 'opacity-70 cursor-wait' : ''}`}
                                                >
                                                    {processingPlan === plan.slug ? "جاري التحويل..." : (<><RefreshCw size={16} /> تجديد الاشتراك</>)}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSubscribe(plan.slug)}
                                                    disabled={processingPlan !== null}
                                                    className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${buttonClass}
                                                ${processingPlan !== null ? 'opacity-70 cursor-wait' : ''}
                                            `}
                                                >
                                                    {processingPlan === plan.slug ? "جاري التحويل..." : "اشترك الآن"}
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Journalist Section - Only show for authenticated normal users */}
                    {!isGuest && !isJournalist && !isAdmin && (
                        <div className="mt-24 text-center bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden" data-aos="zoom-in">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50"></div>

                            <h2 className="text-3xl font-black text-[#020617] mb-4">هل أنت صحفي محترف؟</h2>
                            <p className="text-gray-500 max-w-xl mx-auto mb-8 font-medium text-lg">
                                انضم إلى فريق مدقق واحصل على صلاحيات النشر، شارة الصحفي المعتمد، وأولوية الظهور في نتائج البحث.
                            </p>

                            {upgradeRequestStatus === 'pending' ? (
                                <div className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-100 text-yellow-700 font-bold rounded-2xl border border-yellow-200">
                                    <FaClock className="text-sm" />
                                    طلبك قيد المراجعة
                                </div>
                            ) : upgradeRequestStatus === 'approved' ? (
                                <div className="inline-flex items-center gap-2 px-8 py-4 bg-green-100 text-green-700 font-bold rounded-2xl border border-green-200">
                                    <FaCheckCircle className="text-sm" />
                                    تمت الموافقة (قم بتحديث الصفحة)
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#b20e1e] text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 hover:bg-red-800 transition-all hover:-translate-y-1"
                                >
                                    <FaPenNib className="text-sm" />
                                    قدم طلب انضمام كصحفي
                                </button>
                            )}
                        </div>
                    )}

                    <JoinJournalistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                </div>
            </main>
            <Footer />
        </div>
    );
}
