import React from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Heart,
  Calendar,
  User,
  Tag,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
} from "lucide-react";

export default function PostShow({ auth, post }) {
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

  const getVerdictStyle = (verdict) => {
    const styles = {
      موثوق: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        iconColor: "text-emerald-600",
        Icon: CheckCircle2,
      },
      كاذب: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-800",
        iconColor: "text-rose-600",
        Icon: XCircle,
      },
      مضلل: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        iconColor: "text-amber-600",
        Icon: AlertTriangle,
      },
    };
    return styles[verdict] || styles["مضلل"];
  };

  const verdictStyle = getVerdictStyle(post.ai_verdict);
  const VerdictIcon = verdictStyle.Icon;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={post.title} />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            {/* Verdict Banner - Modernized */}
            <div
              className={`px-8 py-6 ${verdictStyle.bg} border-b ${verdictStyle.border}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 bg-white rounded-xl shadow-sm ${verdictStyle.iconColor}`}
                >
                  <VerdictIcon size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${verdictStyle.text}`}>
                    تحليل الذكاء الاصطناعي: {post.ai_verdict}
                  </h3>
                  <p className={`text-sm mt-1 opacity-80 ${verdictStyle.text}`}>
                    تمت مراجعة هذا المحتوى آلياً للتحقق من المصداقية
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Category & Date */}
              <div className="flex items-center gap-3 mb-6">
                {post.category && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg flex items-center gap-2">
                    <Tag size={14} />
                    {post.category.name}
                  </span>
                )}
                <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(post.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                {post.title}
              </h1>

              {/* Author Row */}
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {post.user.name}
                    </p>
                    <p className="text-sm text-slate-500">ناشر المحتوى</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`hidden sm:flex px-4 py-1.5 rounded-full text-sm font-bold border ${
                    post.status === "published"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {post.status === "published" ? "تم النشر" : post.status}
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-lg prose-slate max-w-none mb-12 leading-loose text-slate-700">
                <p className="whitespace-pre-wrap">{post.body}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-slate-100">
                <button
                  onClick={handleLike}
                  disabled={!auth.user}
                  className={`group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 ${
                    post.is_liked
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl"
                      : "bg-slate-50 text-slate-700 hover:bg-white hover:shadow-lg border border-slate-200"
                  } ${!auth.user ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <Heart
                    size={24}
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      post.is_liked ? "fill-current" : ""
                    }`}
                  />
                  <span>
                    {post.is_liked ? "أعجبك" : "إعجاب"} ({post.likes_count || 0}
                    )
                  </span>
                </button>

                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Share2 size={20} />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Likes Section */}
          {post.likes && post.likes.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <ThumbsUp size={20} />
                </div>
                أشخاص أعجبهم هذا المنشور ({post.likes.length})
              </h3>

              <div className="flex flex-wrap gap-3">
                {post.likes.slice(0, 10).map((like) => (
                  <div
                    key={like.id}
                    className="flex items-center gap-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 pl-4 pr-2 py-2 rounded-full transition-all duration-300 cursor-default"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 font-bold text-xs ring-2 ring-indigo-50">
                      {like.user?.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {like.user?.name}
                    </span>
                  </div>
                ))}

                {post.likes.length > 10 && (
                  <div className="flex items-center px-4 py-2 text-sm font-bold text-slate-500 bg-slate-50 rounded-full">
                    +{post.likes.length - 10} آخرين
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
