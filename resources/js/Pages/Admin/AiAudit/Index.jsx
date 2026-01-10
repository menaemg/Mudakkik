import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Search, 
  Filter, 
  Loader2, 
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import AdminPagination from "@/Layouts/AdminPagination";

export default function Index({ posts, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [verdictFilter, setVerdictFilter] = useState(filters.verdict || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const currentSearch = queryParams.get("search") || "";
      const currentStatus = queryParams.get("status") || "";
      const currentVerdict = queryParams.get("verdict") || "";

      if (
        searchTerm !== currentSearch || 
        statusFilter !== currentStatus || 
        verdictFilter !== currentVerdict
      ) {
        router.get(
          route("admin.ai-audit.index"),
          { 
            search: searchTerm, 
            status: statusFilter, 
            verdict: verdictFilter, 
            page: 1 
          },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
          }
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, verdictFilter, filters]);

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
          <div className="flex items-center gap-1 text-[9px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
            <ShieldAlert size={10} /> مضلل
          </div>
        );
      case "fake":
        return (
          <div className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            <ShieldX size={10} /> زائف
          </div>
        );
      case "checking":
        return (
          <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            <Loader2 size={10} className="animate-spin" /> قيد المعالجة
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <Head title="التدقيق الذكي للمحتوى" />

      <div className="p-8 bg-[#f8fafc] min-h-screen">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#001246] mb-2">التدقيق الذكي</h1>
            <p className="text-slate-500 text-sm font-medium">مراقبة وتحليل جودة المقالات المنشورة آلياً</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-white/50 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="البحث في المقالات..."
                  className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#001246]/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="bg-slate-50 border-none rounded-2xl text-sm font-bold py-3 pr-10 focus:ring-2 focus:ring-[#001246]/5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">حالة النشر</option>
                  <option value="published">منشور</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="rejected">مرفوض</option>
                </select>

                <select
                  className="bg-slate-50 border-none rounded-2xl text-sm font-bold py-3 pr-10 focus:ring-2 focus:ring-[#001246]/5"
                  value={verdictFilter}
                  onChange={(e) => setVerdictFilter(e.target.value)}
                >
                  <option value="">تصنيف الذكاء الاصطناعي</option>
                  <option value="trusted">موثوق</option>
                  <option value="misleading">مضلل</option>
                  <option value="fake">زائف</option>
                  <option value="checking">قيد الفحص</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider">المقال</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-center">سكور الجودة</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-right">تقرير الـ AI</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider">تاريخ النشر</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-wider text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.data.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-[#001246] line-clamp-1">{post.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md uppercase">{post.status}</span>
                          <span>بواسطة: {post.user?.name || 'مستخدم غير معروف'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {post.ai_score !== null ? (
                          <>
                            <div className={`text-xl font-black ${
                              post.ai_score >= 80 ? "text-green-600" : 
                              post.ai_score >= 50 ? "text-yellow-500" : "text-red-500"
                            }`}>
                              {post.ai_score}%
                            </div>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  post.ai_score >= 80 ? "bg-green-500" : 
                                  post.ai_score >= 50 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${post.ai_score}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2 className="animate-spin text-slate-300" size={20} />
                            <span className="text-[10px] text-slate-400 font-bold">جاري الفحص</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-sm ml-auto">
                        <div className="mb-2 flex justify-start">
                          {getVerdictBadge(post.ai_verdict)}
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#001246] font-medium italic text-right line-clamp-2">
                          {post.ai_score !== null
                            ? post.ai_report || "تم التدقيق بنجاح."
                            : "التحليل قيد التنفيذ..."}
                        </p>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        <span className="text-xs font-bold">
                          {new Date(post.created_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                          className="p-2 hover:bg-white rounded-xl text-[#001246] transition-all hover:shadow-sm group"
                        >
                          <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-slate-50">
            <AdminPagination links={posts.links} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}