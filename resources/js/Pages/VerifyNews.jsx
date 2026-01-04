import React, { useState } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  History,
  ExternalLink,
  HelpCircle,
  Award,
} from "lucide-react";

export default function VerifyNews() {
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!news || news.length < 10) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/verify-news", { content: news });
      const data = response.data;

      const score = parseInt(data.verdict?.confidence || data.confidence_score || 0);
      let finalVerdict = "";

      if (score < 50) finalVerdict = "غير صحيح";
      else if (score >= 50 && score < 70) finalVerdict = "غير مؤكد";
      else if (score >= 70 && score <= 90) finalVerdict = "صحيح";
      else if (score > 90) finalVerdict = "رسمي";

      setResult({
        verdict: finalVerdict,
        confidence_score: score,
        explantion: data.verdict?.summary || data.ai_explantion || "لم يتم العثور على تحليل مفصل.",
        sources: data.sources || data.evidence_sources || [],
        status: data.status,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (verdict) => {
    switch (verdict) {
      case "رسمي":
        return {
          color: "border-blue-600",
          iconBg: "bg-blue-600",
          icon: <Award size={32} />,
          textColor: "text-blue-700",
        };
      case "صحيح":
        return {
          color: "border-emerald-500",
          iconBg: "bg-emerald-500",
          icon: <CheckCircle size={32} />,
          textColor: "text-emerald-600",
        };
      case "غير مؤكد":
        return {
          color: "border-amber-400",
          iconBg: "bg-amber-400",
          icon: <HelpCircle size={32} />,
          textColor: "text-amber-600",
        };
      case "غير صحيح":
        return {
          color: "border-[#D00000]",
          iconBg: "bg-[#D00000]",
          icon: <XCircle size={32} />,
          textColor: "text-[#D00000]",
        };
      default:
        return {
          color: "border-slate-300",
          iconBg: "bg-slate-300",
          icon: <AlertCircle size={32} />,
          textColor: "text-slate-600",
        };
    }
  };

  const config = result ? getStatusConfig(result.verdict) : {};

  return (
    <div className="min-h-screen bg-[#F8FAFF] font-sans text-right pb-10" dir="rtl">
      <Head title="مُدقق - فحص الأخبار" />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-10 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#D00000] p-2 rounded-xl">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black text-[#001246]">كاشف التضليل الرقمي</h1>
          </div>
          <div className="flex items-center gap-4">
            {result?.status === "Fetched from Cache" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                مسترجع من الأرشيف
              </span>
            )}
            <div className="text-sm font-bold text-slate-400 flex items-center gap-2 cursor-pointer hover:text-[#001246]">
              <History size={16} /> سجل الفحص
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 sticky top-8"
          >
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-2 border border-slate-100">
              <div className="p-6">
                <h2 className="text-lg font-black text-[#001246] mb-4 flex items-center gap-2">
                  <Search size={20} className="text-[#D00000]" />
                  مختبر الفحص
                </h2>
                <textarea
                  className="w-full p-6 text-lg bg-[#F8FAFC] rounded-[1.5rem] border-2 border-slate-50 focus:border-[#001246]/10 focus:ring-0 resize-none text-[#001246] min-h-[300px] font-medium transition-all"
                  placeholder="ألصق رابط الخبر أو اكتب الادعاء هنا لنقوم بتحليله..."
                  value={news}
                  onChange={(e) => setNews(e.target.value)}
                />
              </div>

              <div className="p-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 mr-4">{news.length} حرف</span>
                <button
                  onClick={handleVerify}
                  disabled={loading || news.length < 10}
                  className="bg-[#001246] hover:bg-[#D00000] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-20"
                >
                  {loading ? <RefreshCcw className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                  {loading ? "جاري التحليل..." : "ابدأ الفحص"}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[500px] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-4"
                >
                  <div className="p-6 bg-slate-100 rounded-full">
                    <AlertCircle size={48} />
                  </div>
                  <p className="font-bold text-xl">نتائج الفحص ستظهر هنا فور البدء</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[500px] bg-white rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-[#D00000] rounded-full animate-spin"></div>
                    <ShieldCheck
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#001246]"
                      size={32}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[#001246] text-xl mb-2">جاري فحص المصادر الرقمية</p>
                    <p className="text-slate-400 text-sm animate-pulse">يتم الآن التحقق من قواعد البيانات والمصادر الموثوقة...</p>
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key={result.verdict}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-[3rem] shadow-2xl overflow-hidden border-t-[12px] bg-white ${config.color}`}
                >
                  <div className="p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10 bg-[#F8FAFC] p-6 rounded-[2rem]">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl text-white shadow-lg ${config.iconBg}`}>
                          {config.icon}
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-400 block mb-1 uppercase tracking-tighter">حكم النظام النهائي</span>
                          <h3 className={`text-4xl font-black ${config.textColor}`}>{result.verdict}</h3>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 block mb-1">نسبة الدقة</span>
                        <span className="text-4xl font-black text-[#001246]">{result.confidence_score}%</span>
                      </div>
                    </div>

                    <div className="mb-10">
                      <h4 className="font-black text-[#001246] mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-[#D00000]" />
                        خلاصة تحليل الذكاء الاصطناعي
                      </h4>
                      <p className="text-slate-600 leading-[1.9] text-lg font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {result.explantion}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-black text-[#001246] mb-4 px-2">المصادر المكتشفة</h4>
                      <div className="space-y-3">
                        {result.sources?.length > 0 ? (
                          result.sources.map((source, index) => (
                            <motion.a
                              whileHover={{ x: -10 }}
                              key={index}
                              href={source.url}
                              target="_blank"
                              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#001246] transition-all group shadow-sm"
                            >
                              <span className="font-bold text-[#001246] text-sm truncate max-w-[80%]">{source.title}</span>
                              <ExternalLink size={16} className="text-slate-300 group-hover:text-[#D00000]" />
                            </motion.a>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm px-2 italic">لم يتم العثور على روابط مباشرة.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}