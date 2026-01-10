import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  User,
  BarChart3,
  Search,
  Filter,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from "lucide-react";
import AdminPagination from "@/Layouts/AdminPagination";

export default function Index({ posts, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const currentSearch = queryParams.get("search") || "";
      const currentStatus = queryParams.get("status") || "";

      if (searchTerm !== currentSearch || statusFilter !== currentStatus) {
        router.get(
          route("admin.ai-audit.index"),
          { search: searchTerm, status: statusFilter, page: 1 },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
          }
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case "trusted":
        return (
          <div className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            <ShieldCheck size={10} /> موثوق
          </div>
        );
      case "misleading":
        return (
          <div className="flex items-center gap-1 text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
            <ShieldAlert size={10} /> مضلل
          </div>
        );
      case "fake":
        return (
          <div className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            <ShieldX size={10} /> زائف
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 rtl" dir="rtl">
      <Head title="مركز التدقيق الذكي" />

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-red-50 p-3 rounded-2xl">
            <BrainCircuit className="text-red-500" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#001246]">
              مركز التدقيق الذكي
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ابحث عن مقال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-500 transition-all text-right"
            />
          </div>

          <div className="relative md:w-48">
            <Filter
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer text-right"
            >
              <option value="">كل الحالات</option>
              <option value="published">منشور</option>
              <option value="pending">مراجعة / جاري الفحص</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  المقال والكاتب
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                  سكور الجودة
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  تقرير الـ AI
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                  الحالة
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                  الإجراء
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts.data.length > 0 ? (
                posts.data.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-50/30 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-[#001246] text-sm group-hover:text-red-600 transition-colors text-right line-clamp-1">
                          {post.title}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold justify-start">
                          <User size={12} />
                          <span>{post.user?.name}</span>
                          <span className="text-slate-200">|</span>
                          <span>
                            {new Date(post.created_at).toLocaleDateString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {post.ai_score > 0 ? (
                          <>
                            <div
                              className={`text-xl font-black ${
                                post.ai_score >= 80
                                  ? "text-green-600"
                                  : post.ai_score >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            >
                              {post.ai_score}%
                            </div>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  post.ai_score >= 80
                                    ? "bg-green-500"
                                    : post.ai_score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${post.ai_score}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2
                              className="animate-spin text-slate-300"
                              size={20}
                            />
                            <span className="text-[10px] text-slate-400 font-bold">
                              جاري الفحص
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-sm ml-auto">
                        <div className="mb-2 flex justify-start">
                          {getVerdictBadge(post.ai_verdict)}
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#001246] font-medium italic text-right line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                          {post.ai_score > 0
                            ? post.ai_report || "تم التدقيق بنجاح."
                            : "التحليل قيد التنفيذ..."}
                        </p>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        {post.status === "published" ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black border border-green-100">
                            <CheckCircle2 size={14} /> منشور
                          </div>
                        ) : post.status === "pending" ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-xl text-[10px] font-black border border-yellow-100">
                            <AlertCircle size={14} />{" "}
                            {post.ai_score > 0 ? "مراجعة" : "جاري الفحص"}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100">
                            <XCircle size={14} /> مرفوض
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <Link
                        href={route("admin.posts.edit", post.id)}
                        className="p-3 bg-white border border-slate-200 text-[#001246] rounded-2xl hover:bg-[#001246] hover:text-white transition-all inline-flex items-center shadow-sm"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-slate-400 font-bold"
                  >
                    <BarChart3
                      size={48}
                      className="mx-auto text-slate-200 mb-4"
                    />
                    لم يتم العثور على أي بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50">
          <AdminPagination
            links={posts.links}
            total={posts.total}
            label="إجمالي نتائج الفحص"
          />
        </div>
      </div>
    </div>
  );
}

Index.layout = (page) => <AdminLayout children={page} />;