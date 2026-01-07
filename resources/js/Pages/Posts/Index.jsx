import React, { useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Search,
  Filter,
  Clock,
  ArrowLeft,
  Heart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";

function SearchAndFilter({ initialQ = "", initialCategory = "", categories = [] }) {
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
    <form onSubmit={submit} className="w-full flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full space-y-2">
        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">كلمات البحث</label>
        <div className="relative group">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#b20e1e] transition-colors" />
          </div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في أرشيف الحقيقة..."
            className="w-full pl-4 pr-12 py-4 bg-gray-50/50 border-2 border-gray-100 focus:bg-white focus:border-[#b20e1e]/30
            focus:ring-4 focus:ring-[#b20e1e]/10 rounded-2xl transition-all outline-none text-gray-900 placeholder:text-gray-400 font-bold"
          />
        </div>
      </div>

      <div className="min-w-[200px] w-full md:w-auto space-y-2">
        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">القسم</label>
        <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-4 pr-10 py-4 bg-gray-50/50 border-2 border-gray-100 focus:bg-white focus:border-[#b20e1e]/30
            focus:ring-4 focus:ring-[#b20e1e]/10 rounded-2xl transition-all outline-none appearance-none cursor-pointer text-gray-900 font-bold"
            >
            <option value="">كل الأقسام</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id || c.slug}>
                {c.name}
                </option>
            ))}
            </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#b20e1e] to-rose-700 text-white font-black rounded-2xl
        shadow-xl shadow-rose-900/20 hover:shadow-2xl hover:shadow-rose-900/40 transition-all duration-300 transform
        hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        <span>ابدأ البحث</span>
      </button>
    </form>
  );
}

export default function PostsIndex({ auth, posts, categories, filters }) {

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const getCategoryName = (categoryFilter) => {
    if (!categoryFilter || !categories) return null;
    let category = categories.find(cat => cat.slug === categoryFilter);
    if (!category && !isNaN(categoryFilter)) {
      category = categories.find(cat => cat.id === parseInt(categoryFilter));
    }
    return category ? category.name : null;
  };

  const getPageTitle = () => {
    const categoryName = getCategoryName(filters?.category);
    return categoryName ? `${categoryName} - الأرشيف` : 'أرشيف الأخبار';
  };

  const getVerdictStyle = (verdict) => {
    const styles = {
      trusted: {
          label: "موثوق",
          bg: "bg-emerald-500",
          glow: "shadow-emerald-500/50",
          text: "text-white",
          icon: <CheckCircle2 size={16} />,
          border: "border-emerald-400"
      },
      fake: {
          label: "زائف",
          bg: "bg-rose-600",
          glow: "shadow-rose-600/50",
          text: "text-white",
          icon: <XCircle size={16} />,
          border: "border-rose-500"
      },
      misleading: {
          label: "مضلل",
          bg: "bg-amber-500",
          glow: "shadow-amber-500/50",
          text: "text-white",
          icon: <AlertTriangle size={16} />,
          border: "border-amber-400"
      },
    };
    return styles[verdict] || styles["misleading"];
  };

  const decodeLabel = (label) => {
    if (!label) return "";
    return label.replace(/&laquo;/g, "«").replace(/&raquo;/g, "»");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">
      <Head title={getPageTitle()} />
      <Header auth={auth} />

      <main className="flex-grow">

        <div className="relative pt-40 pb-36 md:pb-48 overflow-hidden bg-[#020617]">

             <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),
                linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#b20e1e]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
             </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border
                border-white/10 text-blue-300 text-sm font-bold mb-6 backdrop-blur-md shadow-lg" data-aos="fade-down">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>تحليل لحظي للأخبار</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl" data-aos="fade-up">
                    {filters?.category ? `استعرض أخبار ${getCategoryName(filters.category)}` : 'الأرشيف الإخباري'}
                </h1>

                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium" data-aos="fade-up" data-aos-delay="100">
                    منصة متكاملة تجمع بين قوة الذكاء الاصطناعي والمراجعة البشرية لضمان وصول الحقيقة إليك.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

            <div className="-mt-20 relative z-20 bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem]
            shadow-2xl shadow-[#020617]/10 border border-white" data-aos="fade-up">
                <SearchAndFilter
                    initialQ={filters?.q || ""}
                    initialCategory={filters?.category || ""}
                    categories={categories || []}
                />
            </div>

            <div className="flex flex-wrap gap-6 mt-10 mb-12" data-aos="fade-in">
                 <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <TrendingUp size={16} className="text-emerald-600" />
                    <span>{posts.total || 0} خبر موثق</span>
                 </div>
                 <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>مدعوم بالذكاء الاصطناعي</span>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.data.map((post, index) => {
                const verdictStyle = getVerdictStyle(post.ai_verdict);
                return (
                  <div
                    key={post.id}
                    className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border
                    border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >

                    <Link href={route("posts.show", post.slug)} className="relative h-64 overflow-hidden block">
                      {post.image ? (
                        <img
                          src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/post.webp'; }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gray-100`}>
                          <FileText className="w-16 h-16 text-gray-300" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent
                      to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      <div className="absolute top-4 left-4 z-20">
                         <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider
                          ${verdictStyle.bg} ${verdictStyle.text} shadow-lg ${verdictStyle.glow} flex items-center gap-2 border ${verdictStyle.border} backdrop-blur-sm`}>
                            {verdictStyle.icon}
                            <span>{verdictStyle.label}</span>
                         </span>
                      </div>

                      <div className="absolute top-4 right-4 z-20">
                         <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[#020617] text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                            {post.category?.name || "عام"}
                         </span>
                      </div>
                    </Link>

                    <div className="p-7 flex flex-col flex-grow relative">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3 font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(post.created_at).toLocaleDateString("ar-EG")}</span>
                      </div>

                      <Link href={route("posts.show", post.slug)} className="block mb-3">
                        <h2 className="text-xl font-black text-[#020617] leading-snug group-hover:text-[#b20e1e] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                        {post.body}
                      </p>

                      <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200
                            flex items-center justify-center overflow-hidden text-[#020617] font-black text-xs uppercase shadow-sm">
                                {post.user?.avatar ? (
                                    <img src={post.user.avatar.startsWith('http') ? post.user.avatar : `/storage/${post.user.avatar}`} className="w-full h-full object-cover" />
                                ) : (
                                    post.user?.name?.charAt(0) || "M"
                                )}
                            </div>
                            <span className="text-xs font-bold text-gray-600 truncate max-w-[100px]">{post.user?.name || "محرر الموقع"}</span>
                         </div>

                         <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-rose-500 transition-colors">
                                <Heart className={`w-4 h-4 ${post.is_liked ? "fill-rose-500 text-rose-500" : ""}`} />
                                <span className="text-xs font-bold">{post.likes_count || 0}</span>
                           </div>
                           <Link href={route("posts.show", post.slug)} className="flex items-center gap-1 text-xs font-bold
                           text-[#b20e1e] hover:text-[#020617] transition-colors">
                                قراءة
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                           </Link>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {posts.data.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 mt-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center animate-bounce">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">عذراً، لا توجد نتائج</h3>
                <p className="text-gray-500 font-medium">جرب البحث بكلمات مختلفة أو تصفح الأقسام الأخرى</p>
              </div>
            )}

            {posts.links && posts.links.length > 3 && (
              <div className="mt-20 flex flex-wrap justify-center gap-2">
                {posts.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    className={`px-5 py-3 text-sm rounded-2xl font-bold transition-all duration-300 border shadow-sm ${link.active ?
                      "bg-[#020617] border-[#020617] text-white shadow-xl shadow-black/20 scale-110" : link.url ?
                      "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-1" :
                      "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"}`}
                  >
                    {decodeLabel(link.label)}
                  </Link>
                ))}
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
