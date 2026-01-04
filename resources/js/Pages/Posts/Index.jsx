import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Heart,
  MessageSquare,
  Eye,
  Search,
  Filter,
  Hash,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowLeft,
} from "lucide-react";

function SearchAndFilter({
  initialQ = "",
  initialCategory = "",
  categories = [],
}) {
  const [q, setQ] = React.useState(initialQ);
  const [category, setCategory] = React.useState(initialCategory);

  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    router.get(
      route("posts.index"),
      { q: q || undefined, category: category || undefined },
      { preserveState: true, replace: true }
    );
  };

  return (
    <form onSubmit={submit} className="w-full flex flex-col md:flex-row gap-4">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن منشور..."
          className="w-full pl-4 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="relative min-w-[200px] group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
          <Filter className="h-5 w-5 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full pl-4 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm outline-none appearance-none cursor-pointer text-slate-700"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id || c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>بحث</span>
      </button>
    </form>
  );
}

export default function PostsIndex({ auth, posts, categories, filters }) {
  const getVerdictStyle = (verdict) => {
    const styles = {
      trusted: {
        label: "موثوق",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: "✓",
        badgeBg: "bg-emerald-500 text-white",
      },
      fake: {
        label: "كاذب",
        bg: "bg-rose-50",
        text: "text-rose-700",
        icon: "✗",
        badgeBg: "bg-rose-500 text-white",
      },
      misleading: {
        label: "مضلل",
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: "⚠",
        badgeBg: "bg-amber-500 text-white",
      },
    };
    return styles[verdict] || styles["misleading"];
  };

  const decodeLabel = (label) => {
    if (!label) return "";
    return label
      .replace(/<[^>]*>/g, "")
      .replace(/&laquo;/g, "«")
      .replace(/&raquo;/g, "»")
      .replace(/&hellip;/g, "…");
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="المنشورات" />

      {/* Animated Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-300/15 to-rose-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-12 space-y-8">
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-700 font-semibold text-sm mb-4 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>مجتمع مدقق للتحقق من الأخبار</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight leading-tight">
                  استكشف المنشورات
                </h1>
                <p className="text-lg text-slate-600 mt-4 max-w-2xl md:mr-0 md:ml-auto">
                  تصفح آخر الأخبار والتحليلات الموثقة من مجتمعنا المتخصص في التحقق من المعلومات
                </p>
              </div>

              {/* Search Card */}
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-indigo-500/5 border border-white/50">
                <SearchAndFilter
                  initialQ={filters?.q || ""}
                  initialCategory={filters?.category || ""}
                  categories={categories || []}
                />
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-semibold">{posts.total || posts.data.length} منشور</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold">تحديث مستمر</span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.data.map((post, index) => {
                const verdictStyle = getVerdictStyle(post.ai_verdict);
                return (
                  <div
                    key={post.id}
                    className="group relative rounded-3xl shadow-lg border border-slate-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white hover:shadow-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Post Image */}
                    {post.image ? (
                      <Link href={route("posts.show", post.slug)} className="block relative">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={`/storage/${post.image}`}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                        {/* Floating Verdict Badge on Image */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${verdictStyle.badgeBg} shadow-lg flex items-center gap-2`}>
                            <span className="text-base">{verdictStyle.icon}</span>
                            <span>{verdictStyle.label}</span>
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className={`relative h-32 flex items-center justify-center ${verdictStyle.bg}`}>
                        <Sparkles className={`w-10 h-10 ${verdictStyle.text} opacity-50`} />
                        {/* Floating Verdict Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${verdictStyle.badgeBg} shadow-lg flex items-center gap-2`}>
                            <span className="text-base">{verdictStyle.icon}</span>
                            <span>{verdictStyle.label}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 relative">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(post.created_at).toLocaleDateString("ar-EG")}</span>
                      </div>

                      {/* Content */}
                      <Link href={route("posts.show", post.slug)} className="block group/link">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover/link:text-indigo-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                          {post.body}
                        </p>
                      </Link>

                      {/* Hashtags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/50 hover:border-indigo-300 transition-colors cursor-pointer"
                            >
                              <Hash className="w-3 h-3" />
                              {tag.name}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium text-slate-400">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 border border-slate-200/50">
                          {post.category?.name || "عام"}
                        </span>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Heart
                              className={`w-4 h-4 transition-all ${post.is_liked
                                  ? "fill-rose-500 text-rose-500 scale-110"
                                  : "text-slate-400 group-hover:text-rose-400"
                                }`}
                            />
                            <span className={`text-xs font-bold ${post.is_liked ? "text-rose-500" : "text-slate-500"}`}>
                              {post.likes_count || 0}
                            </span>
                          </div>

                          <Link
                            href={route("posts.show", post.slug)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
                          >
                            <span>اقرأ</span>
                            <ArrowLeft className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {posts.data.length === 0 && (
              <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 mt-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد منشورات</h3>
                <p className="text-slate-500 font-medium">
                  لا توجد منشورات تطابق بحثك حالياً
                </p>
              </div>
            )}

            {/* Pagination */}
            {posts.links && posts.links.length > 3 && (
              <div className="mt-16 flex flex-wrap justify-center gap-2">
                {posts.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    className={`px-5 py-2.5 text-sm rounded-xl font-bold transition-all duration-300 ${
                      link.active
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 scale-110"
                        : link.url
                          ? "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-lg border border-slate-200/50 hover:border-indigo-200 hover:-translate-y-0.5"
                          : "bg-slate-50 text-slate-400 cursor-not-allowed"
                      }`}
                    preserveScroll
                  >
                    {decodeLabel(link.label)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
