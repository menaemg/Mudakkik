import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Heart,
  Calendar,
  User,
  Tag,
  Hash,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

export default function PostShow({ auth, post }) {
  const [copied, setCopied] = React.useState(false);

  const handleLike = () => {
    if (!auth.user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    router.post(
      route("posts.like", post.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {},
      }
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getVerdictStyle = (verdict) => {
    const styles = {
      trusted: {
        label: "موثوق",
        bg: "bg-emerald-50",
        border: "border-emerald-300",
        text: "text-emerald-700",
        iconBg: "bg-emerald-500",
        iconColor: "text-white",
        Icon: CheckCircle2,
        description: "تم التحقق من صحة هذا المحتوى - المعلومات دقيقة وموثوقة",
        cardBorder: "border-emerald-300",
        glowColor: "shadow-emerald-100",
      },
      fake: {
        label: "كاذب",
        bg: "bg-rose-50",
        border: "border-rose-300",
        text: "text-rose-700",
        iconBg: "bg-rose-500",
        iconColor: "text-white",
        Icon: XCircle,
        description: "تحذير: هذا المحتوى يحتوي على معلومات غير صحيحة",
        cardBorder: "border-rose-300",
        glowColor: "shadow-rose-100",
      },
      misleading: {
        label: "مضلل",
        bg: "bg-amber-50",
        border: "border-amber-300",
        text: "text-amber-700",
        iconBg: "bg-amber-500",
        iconColor: "text-white",
        Icon: AlertTriangle,
        description: "تنبيه: هذا المحتوى قد يحتوي على معلومات مضللة",
        cardBorder: "border-amber-300",
        glowColor: "shadow-amber-100",
      },
    };
    return styles[verdict] || styles["misleading"];
  };

  const verdictStyle = getVerdictStyle(post.ai_verdict);
  const VerdictIcon = verdictStyle.Icon;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={post.title} />

      {/* Animated Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-to-r from-pink-300/15 to-rose-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href={route("posts.index")}
              className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl text-slate-600 font-semibold hover:bg-white hover:shadow-lg border border-slate-200/50 transition-all hover:-translate-y-0.5 group"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>العودة للمنشورات</span>
            </Link>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
              {/* Verdict Banner - Clean */}
              <div className={`px-8 py-6 ${verdictStyle.bg} border-b ${verdictStyle.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${verdictStyle.iconBg} rounded-xl ${verdictStyle.iconColor}`}>
                    <VerdictIcon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${verdictStyle.text}`}>
                      {verdictStyle.label}
                    </h3>
                    <p className={`text-sm mt-1 ${verdictStyle.text} opacity-80`}>
                      {verdictStyle.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Image - Enhanced */}
              {post.image && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`/storage/${post.image}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              )}

              <div className="p-8 md:p-12 relative">
                {/* Meta Info Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  {post.category && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 shadow-sm">
                      <Tag size={14} />
                      {post.category.name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <Calendar size={14} className="text-slate-500" />
                    </div>
                    {new Date(post.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <BookOpen size={14} className="text-slate-500" />
                    </div>
                    {Math.ceil(post.body?.length / 200) || 1} دقائق قراءة
                  </span>
                </div>

                {/* Title - Enhanced */}
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Hashtags - Enhanced */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-10">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 text-indigo-700 border border-indigo-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Hash size={16} className="text-indigo-500" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Row - Enhanced */}
                <div className="flex items-center justify-between pb-10 mb-10 border-b-2 border-slate-100/80">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                        <User size={28} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center ring-2 ring-white">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xl">
                        {post.user.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <span>ناشر المحتوى</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>موثق</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border-2 shadow-sm ${
                      post.status === "published"
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200"
                        : "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {post.status === "published" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {post.status === "published" ? "تم النشر" : post.status}
                  </div>
                </div>

                {/* Body Content - Enhanced */}
                <div className="prose prose-lg prose-slate max-w-none mb-12">
                  <div className="text-slate-700 text-lg leading-loose whitespace-pre-wrap bg-gradient-to-br from-slate-50/50 to-transparent p-6 rounded-2xl border border-slate-100/50">
                    {post.body}
                  </div>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-10 border-t-2 border-slate-100/80">
                  <button
                    onClick={handleLike}
                    disabled={!auth.user}
                    className={`group relative w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform active:scale-95 ${
                      post.is_liked
                        ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-size-200 text-white shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 hover:shadow-xl border-2 border-slate-200/50 hover:border-rose-200"
                    } ${!auth.user ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1"}`}
                  >
                    <Heart
                      size={26}
                      className={`transition-all duration-500 ${
                        post.is_liked ? "fill-current animate-pulse" : "group-hover:scale-125"
                      }`}
                    />
                    <span>
                      {post.is_liked ? "أعجبك" : "إعجاب"}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-sm ${post.is_liked ? "bg-white/20" : "bg-slate-200/50"}`}>
                      {post.likes_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-slate-600 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 border-2 border-slate-200/50 hover:border-indigo-200 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    {copied ? (
                      <>
                        <Check size={22} className="text-emerald-500" />
                        <span className="text-emerald-600">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={22} className="group-hover:rotate-12 transition-transform" />
                        <span>مشاركة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Posts Suggestion (placeholder) */}
            <div className="mt-12 text-center">
              <Link
                href={route("posts.index")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40"
              >
                <span>استكشف المزيد من المنشورات</span>
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
