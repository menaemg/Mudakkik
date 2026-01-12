import React, { useEffect, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
import {
    Heart,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Share2,
    Shield,
    ChevronLeft,
    Check,
    FileText,
    Sparkles,

} from "lucide-react";

export default function PostShow({ auth, post }) {
    const [copied, setCopied] = React.useState(false);
    const copyTimeoutRef = useRef(null);
    const { flash } = usePage().props;

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 50 });

        // Cleanup timeout on unmount
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    // Handle flash messages with popup
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'تم بنجاح',
                text: flash.success,
                confirmButtonColor: '#10b981',
                confirmButtonText: 'حسناً',
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: flash.error,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'حسناً',
            });
        }
        if (flash?.warning) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: flash.warning,
                confirmButtonColor: '#f59e0b',
                confirmButtonText: 'حسناً',
            });
        }
    }, [flash]);

    const handleLike = () => {
        if (!auth.user) {
            alert("يجب تسجيل الدخول أولاً");
            return;
        }
        router.post(route("posts.like", post.id), {}, { preserveScroll: true });
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url: url });
                return;
            } catch (err) { console.log(err); }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
        }

        // Clear existing timeout before setting new one
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    };

    const getVerdictStyle = (verdict) => {
        const styles = {
            trusted: {
                label: "محتوى موثوق",
                description: "تمت مراجعة هذا المحتوى والتحقق من مصادره بدقة. المعلومات الواردة هنا صحيحة وتستند إلى حقائق.",
                containerClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
                icon: <CheckCircle2 size={36} className="text-emerald-600" />,
                badgeColor: "bg-emerald-600",
                accentBorder: "border-l-4 border-l-emerald-600"
            },
            fake: {
                label: "محتوى زائف",
                description: "تحذير: هذا المحتوى تم تصنيفه كمعلومات غير صحيحة أو مفبركة بناءً على تحليل البيانات والمصادر.",
                containerClass: "bg-red-50 border-red-200 text-red-900",
                icon: <XCircle size={36} className="text-red-600" />,
                badgeColor: "bg-red-600",
                accentBorder: "border-l-4 border-l-red-600"
            },
            misleading: {
                label: "محتوى مضلل",
                description: "تنبيه: هذا المحتوى قد يحتوي على حقائق ممزوجة بمعلومات غير دقيقة أو تم إخراجها عن سياقها.",
                containerClass: "bg-amber-50 border-amber-200 text-amber-900",
                icon: <AlertTriangle size={36} className="text-amber-600" />,
                badgeColor: "bg-amber-600",
                accentBorder: "border-l-4 border-l-amber-600"
            },
        };
        return styles[verdict] || styles["misleading"];
    };

    const verdictStyle = getVerdictStyle(post.ai_verdict);

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">
            <Head title={post.title} />
            <Header auth={auth} />

            <main className="flex-grow">

                <div className="relative pt-40 pb-36 md:pb-52 overflow-hidden bg-[#020617]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="absolute left-0 top-20 w-[500px] h-[500px] bg-[#b20e1e]/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                    <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-8 backdrop-blur-md shadow-2xl" data-aos="fade-down">
                            {post.category && <span className="text-[#b20e1e] font-black uppercase tracking-wider">{post.category.name}</span>}
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <Clock size={14} />
                            <span>{new Date(post.created_at).toLocaleDateString("ar-EG", { month: 'long', day: 'numeric' })}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-10 drop-shadow-lg tracking-tight" data-aos="fade-up">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center" data-aos="fade-up" data-aos-delay="100">
                            <div className="flex items-center gap-4 bg-white/5 pr-2 pl-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-default group">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b20e1e] to-purple-600 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                                    <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-white overflow-hidden">
                                        {post.user?.avatar ? (
                                            <img src={post.user.avatar.startsWith('http') ? post.user.avatar : `/storage/${post.user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-black text-lg uppercase">{post.user?.name?.charAt(0) || "M"}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-bold leading-none mb-1.5">{post.user?.name}</p>
                                    <p className="text-gray-400 text-[10px] font-bold tracking-wide flex items-center gap-1">
                                        <CheckCircle2 size={10} className="text-blue-400" />
                                        صحفي معتمد
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 -mt-24 md:-mt-36 relative z-20 mb-16" data-aos="zoom-in" data-aos-duration="1000">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#020617]/40 border-[8px] border-white bg-white relative aspect-video group">
                        {post.image ? (
                            <img
                                src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                onError={(e) => { e.target.src = '/assets/images/post.webp'; }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-4">
                                <FileText size={64} />
                                <span className="text-sm font-bold opacity-60">لا توجد صورة مرافقة</span>
                            </div>
                        )}

                        <div className="absolute top-6 left-6 z-20">
                            <button
                                onClick={handleShare}
                                className={`w-14 h-14 rounded-full backdrop-blur-xl flex items-center justify-center shadow-xl border border-white/30 transition-all duration-300 hover:scale-110
                        ${copied ? "bg-emerald-500 text-white" : "bg-white/90 text-gray-800 hover:bg-[#b20e1e] hover:text-white"}`}
                            >
                                {copied ? <Check size={24} /> : <Share2 size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">

                    <div className="lg:col-span-8">

                        <div
                            className={`relative overflow-hidden rounded-xl border ${verdictStyle.containerClass} ${verdictStyle.accentBorder} shadow-sm mb-12`}
                            data-aos="fade-up"
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                                <div className="shrink-0">
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                        {verdictStyle.icon}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-2xl tracking-tight">{verdictStyle.label}</h3>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-current opacity-70 uppercase tracking-widest">
                                            <Sparkles size={10} />
                                            AI Verified
                                        </span>
                                    </div>

                                    <p className="opacity-90 leading-relaxed font-medium text-lg">
                                        {verdictStyle.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <article className="prose prose-xl prose-slate max-w-none mb-16 prose-headings:font-black prose-headings:text-[#020617] prose-p:text-gray-700 prose-p:leading-loose prose-strong:text-[#b20e1e]" data-aos="fade-up">
                            <div className="text-lg md:text-xl font-medium whitespace-pre-wrap">
                                <span className="float-right text-7xl font-black text-[#b20e1e] ml-6 mt-[-15px] leading-none drop-shadow-sm font-serif">
                                    {post.body?.charAt(0)}
                                </span>
                                {post.body?.substring(1)}
                            </div>
                        </article>

                        <div className="border-t-2 border-gray-100 pt-10">
                            <div className="flex flex-wrap items-center gap-3 mb-10">
                                {post.category && (
                                    <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-[#020617] hover:text-white transition-all cursor-pointer shadow-sm">
                                        #{post.category.name}
                                    </span>
                                )}
                                <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-[#020617] hover:text-white transition-all cursor-pointer shadow-sm">
                                    #أخبار_عاجلة
                                </span>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row items-center justify-between gap-6" data-aos="zoom-in">
                                <div className="text-center sm:text-right">
                                    <h4 className="font-black text-[#020617] text-xl mb-1">شاركنا رأيك</h4>
                                    <p className="text-gray-500 font-medium">تفاعلك يساعدنا في نشر الحقيقة</p>
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={handleLike}
                                        disabled={!auth.user}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 border-2
                                ${post.is_liked
                                                ? "bg-[#b20e1e] border-[#b20e1e] text-white shadow-rose-500/30"
                                                : "bg-white text-gray-700 border-gray-100 hover:border-[#b20e1e] hover:text-[#b20e1e]"
                                            } ${!auth.user ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <Heart className={`w-6 h-6 ${post.is_liked ? "fill-current" : ""}`} />
                                        <span>{post.likes_count}</span>
                                    </button>

                                    <button onClick={handleShare} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-[#020617] text-white shadow-lg shadow-[#020617]/30 hover:bg-black active:scale-95 transition-all">
                                        {copied ? <Check size={20} /> : <Share2 size={20} />}
                                        <span>{copied ? "تم" : "نشر"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-32" data-aos="fade-left">
                            <div className="w-16 h-16 bg-[#020617] rounded-3xl flex items-center justify-center mb-6 text-white shadow-xl transform -rotate-6">
                                <Shield size={32} />
                            </div>
                            <h3 className="font-black text-2xl text-[#020617] mb-4">بيئة آمنة</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                                نحن ملتزمون بمحاربة الأخبار المضللة. هذا المحتوى خضع لمعايير صارمة قبل النشر.
                            </p>

                            <Link href={route("posts.index")} className="group flex items-center justify-between w-full p-5 bg-gray-50 hover:bg-[#020617] rounded-2xl transition-all duration-300 border border-gray-100 hover:border-transparent cursor-pointer mb-4">
                                <span className="font-bold text-gray-700 group-hover:text-white transition-colors">الأرشيف الكامل</span>
                                <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#020617] shadow-sm group-hover:scale-110 transition-transform">
                                    <ChevronLeft size={20} />
                                </span>
                            </Link>

                            {auth.user && (
                                <Link href={route("posts.report.form", post.id)} className="flex items-center justify-center gap-2 w-full py-4 text-rose-500 text-sm font-bold hover:bg-rose-50 rounded-2xl transition-colors">
                                    <AlertTriangle size={18} />
                                    إبلاغ عن محتوى مخالف
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
