import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Heart, MessageSquare, Eye, Search, Filter } from "lucide-react";

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
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن منشور..."
          className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm outline-none"
        />
      </div>

      <div className="relative min-w-[200px] group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm outline-none appearance-none cursor-pointer"
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
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
      >
        بحث
      </button>
    </form>
  );
}

export default function PostsIndex({ auth, posts, categories, filters }) {
  const getVerdictColor = (verdict) => {
    const colors = {
      موثوق:
        "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
      كاذب: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20",
      مضلل: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20",
    };
    return colors[verdict] || "bg-gray-50 text-gray-600 border-gray-100";
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

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12 space-y-6">
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                استكشف المنشورات
              </h1>
              <p className="text-lg text-slate-500 mt-2">
                تصفح آخر الأخبار والتحليلات الموثقة من مجتمع مدقق
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <SearchAndFilter
                initialQ={filters?.q || ""}
                initialCategory={filters?.category || ""}
                categories={categories || []}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.data.map((post) => (
              <div
                key={post.id}
                className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Verdict Badge */}
                <div className="absolute top-6 left-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ring-1 ${getVerdictColor(
                      post.ai_verdict
                    )}`}
                  >
                    {post.ai_verdict}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-indigo-600 font-bold text-lg">
                      {post.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {post.user.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(post.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <Link href={route("posts.show", post.id)} className="block">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {post.body}
                    </p>
                  </Link>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {post.category?.name || "عام"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          post.is_liked
                            ? "fill-rose-500 text-rose-500"
                            : "group-hover:text-rose-500"
                        }`}
                      />
                      <span className="text-xs font-bold">
                        {post.likes_count || 0}
                      </span>
                    </div>

                    <Link
                      href={route("posts.show", post.id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <span>قراءة</span>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {posts.data.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 mt-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">
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
                  className={`px-4 py-2 text-sm rounded-xl font-bold transition-all ${
                    link.active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : link.url
                      ? "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-indigo-200"
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
    </AuthenticatedLayout>
  );
}
