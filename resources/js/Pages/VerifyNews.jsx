import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head, useForm, usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  ExternalLink,
  HelpCircle,
  Award,
  Activity,
  Sparkles,
  ShieldAlert,
  Cpu,
  Database,
  Globe,
  Zap,
  Terminal,
  BarChart,
  Binary,
  Clock,
  History,
  LayoutGrid,
  List,
  X,
} from "lucide-react";

export default function VerifyNews({ auth, ticker }) {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    text: "",
    period: "3", // Default period
  });
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("new"); // 'new' | 'history'
  useEffect(() => {
    // #history
    if (window.location.hash === "#history") {
      setActiveTab("history");
      // scroll smooth للأعلى
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const [localResult, setLocalResult] = useState(null);

  const result = flash?.result;
  const flashError = flash?.error || errors.text;
  const loading = processing;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    let interval;
    if (loading) {
      setAnalysisStep(1);
      interval = setInterval(() => {
        setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result) {
      setActiveTab("new");
      setLocalResult(null);
    }
  }, [result]);

  // Update error state when flash error changes
  useEffect(() => {
    if (flashError) {
      setError(flashError);
    }
  }, [flashError]);

  const handleVerify = () => {
    if (!auth?.user) {
      setError("يجب تسجيل الدخول لاستخدام هذه الميزة.");
      return;
    }
    if (!data.text || data.text.length < 10) {
      setError("يجب إدخال نص لا يقل عن 10 أحرف.");
      return;
    }
    setError(null); // Clear previous errors
    setLocalResult(null); // Clear previous local results
    post("/verify-news", {
      preserveScroll: true,
      onSuccess: () => {},
      onError: (errors) => {
        if (errors.text) setError(errors.text);
      },
    });
  };

  const handleRetry = () => {
    setError(null);
    setLocalResult(null);
    setData("text", "");
  };

  const handleHistorySelect = (id) => {
    axios
      .get(`/api/fact-check/${id}`)
      .then((res) => {
        setLocalResult(res.data);
        if (res.data.input_text) setData("text", res.data.input_text);
        if (res.data.period) setData("period", res.data.period);

        setError(null);
        setActiveTab("new");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        console.error(err);
        setError("فشل في تحميل تفاصيل التحقق. يرجى المحاولة مرة أخرى.");
      });
  };

  const displayResult = localResult || result;

  const verdictLabel =
    displayResult?.verdict?.label || displayResult?.verdict || "غير مؤكد";
  const defaultConfig = {
    color: "from-gray-500 to-gray-400",
    icon: <HelpCircle size={40} />,
    shadow: "shadow-gray-500/40",
    text: "text-gray-600",
  };
  const verdictConfigs = {
    رسمي: {
      color: "from-blue-600 to-cyan-500",
      icon: <Award size={40} />,
      shadow: "shadow-blue-500/40",
      text: "text-blue-600",
    },
    صحيح: {
      color: "from-emerald-600 to-teal-400",
      icon: <CheckCircle size={40} />,
      shadow: "shadow-emerald-500/40",
      text: "text-emerald-600",
    },
    "غير مؤكد": {
      color: "from-amber-500 to-orange-400",
      icon: <HelpCircle size={40} />,
      shadow: "shadow-amber-500/40",
      text: "text-amber-600",
    },
    "غير صحيح": {
      color: "from-[#b20e1e] to-rose-500",
      icon: <XCircle size={40} />,
      shadow: "shadow-red-500/40",
      text: "text-[#b20e1e]",
    },
  };
  const config = displayResult
    ? verdictConfigs[verdictLabel] ?? defaultConfig
    : {};

  // Validation state
  const isLoggedIn = !!auth?.user;
  const isTextValid = data.text && data.text.length >= 10;
  const canSubmit = isLoggedIn && isTextValid && !loading;

  // Button text based on state
  const getButtonText = () => {
    if (loading) return "جاري المعالجة...";
    if (!isLoggedIn) return "سجل دخول للمتابعة";
    if (!isTextValid)
      return `أدخل ${10 - (data.text?.length || 0)} حرف على الأقل`;
    return "تشغيل الفحص";
  };

  return (
    <div
      className="min-h-screen bg-[#020617] font-sans text-right overflow-x-hidden"
      dir="rtl"
    >
      <Head title="المختبر الذكي | فحص الحقائق" />
      <Header auth={auth} ticker={ticker} />

      <main className="relative">
        {/* --- Animated Cyber Background --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 blur-[150px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        {/* --- Hero Section --- */}
        <div className="relative pt-32 pb-40 z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-3xl mb-6">
              <Binary size={14} className="text-blue-400" />
              <span className="text-blue-400 text-[10px] font-black tracking-[3px] uppercase">
                محرك التحليل الذكي
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">
              مختبر{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#b20e1e] via-rose-500 to-orange-500">
                الحقيقة
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-70">
              أفحص الشائعات باستخدام الذكاء الاصطناعي ومطابقة المصادر الموثوقة
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 -mt-28 pb-16 relative z-20">
          {/* --- Tabs --- */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-xl p-1 rounded-2xl inline-flex border border-white/10">
              <button
                onClick={() => setActiveTab("new")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "new"
                    ? "bg-[#b20e1e] text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Zap size={16} />
                فحص جديد
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "history"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <History size={16} />
                  السجل السابق
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "new" ? (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-right"
              >
                <div className="lg:col-span-5 relative">
                  <div className="sticky top-24 h-auto bg-white/5 backdrop-blur-[40px] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider mr-3">
                          محطة التحقق
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isLoggedIn && (
                          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <Zap
                              size={12}
                              className={
                                canSubmit
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-500"
                              }
                            />
                            <span className="text-[10px] font-bold text-gray-300">
                              {auth.user?.credits?.total_ai || 0} رصيد
                            </span>
                          </div>
                        )}

                        <div className="relative group">
                          <select
                            value={data.period}
                            onChange={(e) => setData("period", e.target.value)}
                            className="appearance-none pl-8 pr-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-gray-300 font-bold outline-none cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
                            dir="rtl"
                          >
                            <option value="1" className="bg-[#0f172a]">
                              آخر 24 ساعة
                            </option>
                            <option value="3" className="bg-[#0f172a]">
                              آخر 3 أيام
                            </option>
                            <option value="7" className="bg-[#0f172a]">
                              آخر أسبوع
                            </option>
                            <option value="30" className="bg-[#0f172a]">
                              آخر شهر
                            </option>
                            <option value="365" className="bg-[#0f172a]">
                              آخر سنة
                            </option>
                          </select>
                          <Clock
                            size={12}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-grow">
                      <textarea
                        value={data.text}
                        onChange={(e) => setData("text", e.target.value)}
                        className="w-full min-h-[60vh] bg-transparent text-white text-lg md:text-xl font-medium outline-none resize-none placeholder:text-gray-700 leading-relaxed"
                        placeholder=">>> ألصق الخبر أو الادعاء المطلوب فحصه..."
                      />
                    </div>
                    <button
                      onClick={handleVerify}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleVerify();
                        }
                      }}
                      disabled={!canSubmit}
                      type="button"
                      aria-label={
                        loading ? "جاري المعالجة" : "تشغيل فحص الحقائق"
                      }
                      className={`w-full p-6 flex items-center justify-between group overflow-hidden relative text-right transition-colors
                                                ${
                                                  canSubmit
                                                    ? "bg-[#b20e1e] hover:bg-[#900b18] cursor-pointer"
                                                    : "bg-gray-600 cursor-not-allowed opacity-75"
                                                }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.5 }}
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      ></motion.div>
                      <div className="relative z-10 flex flex-col items-start w-full">
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xl font-black text-white">
                            {getButtonText()}
                          </span>
                        </div>
                        {/* Mobile Credit Display */}
                        {isLoggedIn && (
                          <div className="md:hidden flex items-center gap-2 text-white/60 text-xs font-bold mt-1">
                            <Zap
                              size={12}
                              className={
                                canSubmit ? "text-amber-400 fill-amber-400" : ""
                              }
                            />
                            <span>
                              {auth.user?.credits?.total_ai || 0} رصيد متبقي
                            </span>
                          </div>
                        )}
                        {!isLoggedIn && (
                          <span className="text-white/70 text-xs mt-1">
                            🔒 هذه الميزة تتطلب حساب مسجل
                          </span>
                        )}
                        {isLoggedIn &&
                          !isTextValid &&
                          data.text?.length > 0 && (
                            <span className="text-white/70 text-xs mt-1">
                              ✏️ {data.text.length}/10 حرف
                            </span>
                          )}
                      </div>
                      <div
                        className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform
                                                ${
                                                  canSubmit
                                                    ? "bg-white group-hover:rotate-12"
                                                    : "bg-white/50"
                                                }`}
                      >
                        {loading ? (
                          <RefreshCcw
                            className="animate-spin text-[#b20e1e]"
                            size={24}
                          />
                        ) : (
                          <Zap
                            className={
                              canSubmit
                                ? "text-[#b20e1e] fill-[#b20e1e]"
                                : "text-gray-400"
                            }
                            size={24}
                          />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    {!displayResult && !loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full min-h-[400px] rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center p-8"
                      >
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 animate-bounce">
                          {error ? (
                            <ShieldAlert size={48} className="text-red-500" />
                          ) : (
                            <ShieldCheck size={48} className="text-gray-800" />
                          )}
                        </div>
                        <h3
                          className={`text-2xl font-black mb-3 tracking-tighter ${
                            error ? "text-red-500" : "text-gray-600"
                          }`}
                        >
                          {error ? "حدث خطأ" : "بانتظار الأوامر..."}
                        </h3>
                        <p className="text-gray-700 max-w-sm mx-auto font-medium text-sm mb-4">
                          {error
                            ? error
                            : "أدخل النص واضغط على الزر لبدء الفحص"}
                        </p>
                        {error && (
                          <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm"
                          >
                            إعادة المحاولة
                          </button>
                        )}
                      </motion.div>
                    )}

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full min-h-[400px] bg-[#000a2e] rounded-[2.5rem] border border-blue-500/20 shadow-lg flex flex-col items-center justify-center p-10 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1/3 h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"
                          ></motion.div>
                        </div>
                        <div className="text-center space-y-6 relative z-10">
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -15, 0] }}
                                transition={{
                                  duration: 0.8,
                                  delay: i * 0.15,
                                  repeat: Infinity,
                                }}
                                className="w-3 h-3 bg-blue-500 rounded-full"
                              ></motion.div>
                            ))}
                          </div>
                          <h3 className="text-3xl font-black text-white tracking-tighter">
                            جاري الفحص...
                          </h3>
                          <div className="space-y-2">
                            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">
                              {analysisStep === 1 && "البحث في المصادر..."}
                              {analysisStep === 2 && "مطابقة السياق..."}
                              {analysisStep === 3 && "تحليل النتائج..."}
                              {analysisStep === 4 && "إعداد التقرير..."}
                            </p>
                            <p className="text-gray-500 font-medium text-sm">
                              نبحث في أكثر من 30 مصدر موثوق
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {displayResult && !loading && (
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`h-full rounded-[2.5rem] bg-white shadow-xl p-1 border-t-[16px] ${config.shadow}`}
                      >
                        <div className="bg-white rounded-[2.3rem] p-6 md:p-10 h-full">
                          {/* Final Verdict Card */}
                          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 relative group">
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                              {localResult && (
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold border border-blue-200 shadow-sm animate-pulse">
                                  من السجل السابق
                                </span>
                              )}
                              <button
                                onClick={() => setLocalResult(null)}
                                className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                title="فحص جديد"
                              >
                                <X size={20} />
                              </button>
                            </div>
                            <div className="flex items-center gap-6">
                              <div
                                className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${config.color} text-white shadow-lg transform -rotate-6`}
                              >
                                {config.icon}
                              </div>
                              <div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                                  الحكم
                                </span>
                                <h3
                                  className={`text-5xl md:text-6xl font-black ${config.text} tracking-tighter`}
                                >
                                  {verdictLabel}
                                </h3>
                              </div>
                            </div>
                            <div className="text-center md:text-left">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                نسبة الثقة
                              </span>
                              <div className="flex items-baseline justify-center md:justify-end">
                                <span className="text-7xl font-black text-gray-900 leading-none tracking-tighter">
                                  {(
                                    displayResult.verdict?.confidence ||
                                    displayResult.confidence_score
                                  )
                                    ?.toString()
                                    .replace("%", "")}
                                </span>
                                <span className="text-2xl font-black text-gray-300">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-8 mb-12 px-2">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <BarChart
                                  className="text-[#b20e1e]"
                                  size={22}
                                />
                                <h4 className="text-2xl font-black text-[#020617] tracking-tighter">
                                  التقرير التحليلي
                                </h4>
                              </div>
                              <div className="text-lg md:text-xl leading-relaxed text-gray-700 font-medium">
                                {displayResult.verdict?.summary ||
                                  displayResult.summary}
                              </div>
                            </div>

                            {(displayResult.verdict?.evidence ||
                              displayResult.evidence) && (
                              <div className="p-6 bg-red-50 rounded-[2rem] border-r-[8px] border-[#b20e1e] relative overflow-hidden">
                                <ShieldAlert
                                  size={80}
                                  className="absolute -left-6 -top-6 text-red-600/5 rotate-12"
                                />
                                <h5 className="text-[#b20e1e] font-black text-[10px] uppercase tracking-wider mb-2">
                                  الدليل
                                </h5>
                                <p className="text-gray-800 text-base md:text-lg font-bold leading-relaxed relative z-10">
                                  {displayResult.verdict?.evidence ||
                                    displayResult.evidence}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-8">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Globe className="text-white" size={20} />
                              </div>
                              <div>
                                <h4 className="text-xl font-black text-[#020617] tracking-tight">
                                  المصادر الموثوقة
                                </h4>
                                <p className="text-gray-500 text-sm">
                                  {displayResult.sources?.length || 0} مصادر تم
                                  التحقق منها
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {displayResult.sources?.map((source, index) => (
                                <a
                                  key={index}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors group"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                      <h4 className="text-gray-900 font-bold mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {source.title || "عنوان غير متاح"}
                                      </h4>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Globe size={12} />
                                        <span dir="ltr">
                                          {(() => {
                                            try {
                                              return new URL(
                                                source.url
                                              ).hostname.replace("www.", "");
                                            } catch (e) {
                                              return "مصدر غير معروف";
                                            }
                                          })()}
                                        </span>
                                        {source.date && (
                                          <>
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            <span>{source.date}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <ExternalLink
                                      size={16}
                                      className="text-gray-400 group-hover:text-blue-600 transition-colors"
                                    />
                                  </div>
                                </a>
                              ))}
                              {(!displayResult.sources ||
                                displayResult.sources.length === 0) && (
                                <div className="text-center py-8 text-gray-400">
                                  <Globe
                                    size={32}
                                    className="mx-auto mb-2 opacity-50"
                                  />
                                  <p className="text-sm">
                                    لم يتم العثور على مصادر
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-6xl mx-auto"
              >
                <HistoryList onSelect={handleHistorySelect} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HistoryList({ onSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = () => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/fact-check/history")
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error(err);
        setError("فشل في تحميل السجل. يرجى المحاولة مرة أخرى.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/50 space-y-4">
        <RefreshCcw className="animate-spin text-blue-500" size={32} />
        <span>جاري تحميل السجل...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-400 border-2 border-dashed border-white/5 rounded-3xl">
        <ShieldAlert size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={loadHistory}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white font-bold text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  if (history.length === 0)
    return (
      <div className="text-center py-20 text-white/30 border-2 border-dashed border-white/5 rounded-3xl">
        <History size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">لا يوجد سجل سابق للتحقق</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((check, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          key={check.id}
          onClick={() => onSelect(check.id)}
          className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 cursor-pointer hover:bg-white/10 overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:from-blue-500/10"></div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/5
                            ${
                              check.label === "صحيح"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : check.label === "غير صحيح"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
            >
              {check.label}
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wide">
              {new Date(
                check.pivot?.created_at || check.created_at
              ).toLocaleDateString("ar-EG", { day: "numeric", month: "short" })}
            </span>
          </div>

          <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-white transition-colors duration-300 font-medium">
            {check.input_text}
          </p>

          <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 group-hover:text-blue-300 transition-colors">
              <Clock size={12} />
              <span>بحث {check.period || 3} أيام</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
              <ExternalLink size={14} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
