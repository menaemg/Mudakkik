import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head, useForm, usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    Search, CheckCircle, XCircle, AlertCircle, ShieldCheck,
    RefreshCcw, ExternalLink, HelpCircle, Award, Activity,
    Sparkles, ShieldAlert, Cpu, Database, Globe, Zap, Terminal, BarChart, Binary
} from "lucide-react";

export default function VerifyNews({ auth, ticker }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ text: '' });
    const [analysisStep, setAnalysisStep] = useState(0);

    const result = flash?.result;
    const error = flash?.error || errors.text;
    const loading = processing;

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        let interval;
        if (loading) {
            setAnalysisStep(1);
            interval = setInterval(() => {
                setAnalysisStep(prev => (prev < 4 ? prev + 1 : prev));
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleVerify = () => {
        if (!data.text || data.text.length < 10) return;
        post('/verify-news', {
            preserveScroll: true,
            onSuccess: () => { },
        });
    };

    // Helper logic for verdict labels
    const verdictLabel = result?.verdict?.label || result?.verdict || "غير مؤكد";
    const config = result ? ({
        "رسمي": { color: "from-blue-600 to-cyan-500", icon: <Award size={40} />, shadow: "shadow-blue-500/40", text: "text-blue-600" },
        "صحيح": { color: "from-emerald-600 to-teal-400", icon: <CheckCircle size={40} />, shadow: "shadow-emerald-500/40", text: "text-emerald-600" },
        "غير مؤكد": { color: "from-amber-500 to-orange-400", icon: <HelpCircle size={40} />, shadow: "shadow-amber-500/40", text: "text-amber-600" },
        "غير صحيح": { color: "from-[#b20e1e] to-rose-500", icon: <XCircle size={40} />, shadow: "shadow-red-500/40", text: "text-[#b20e1e]" },
    }[verdictLabel] || { color: "from-gray-500 to-gray-400", icon: <HelpCircle size={40} />, shadow: "shadow-gray-500/40", text: "text-gray-600" }) : {};

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-right overflow-x-hidden" dir="rtl">
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
                <div className="relative pt-56 pb-64 z-10 container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-3xl mb-10">
                            <Binary size={16} className="text-blue-400 animate-spin-slow" />
                            <span className="text-blue-400 text-[10px] font-black tracking-[4px] uppercase">Quantum Analysis Engine</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
                            مختبر <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#b20e1e] via-rose-500 to-orange-500">الحقيقة</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-medium leading-relaxed opacity-70">
                            أفحص الشائعات باستخدام الذكاء الاصطناعي التوليدي ومطابقة المصادر الحية.
                        </p>
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 -mt-48 pb-32 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-5">
                            <div className="h-full bg-white/5 backdrop-blur-[40px] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mr-4">Verification Terminal v4.0</span>
                                    </div>
                                    <Terminal size={18} className="text-gray-600" />
                                </div>
                                <div className="p-8 flex-grow">
                                    <textarea
                                        value={data.text}
                                        onChange={(e) => setData('text', e.target.value)}
                                        className="w-full h-full min-h-[400px] bg-transparent text-white text-xl md:text-2xl font-medium outline-none resize-none placeholder:text-gray-700 leading-relaxed"
                                        placeholder=">>> انقر هنا وألصق الخبر أو الادعاء المطلوب فحصه..."
                                    />
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={loading}
                                    className="w-full p-8 bg-[#b20e1e] flex items-center justify-between group cursor-pointer overflow-hidden relative text-right transition-colors hover:bg-[#900b18] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    <motion.div whileHover={{ scale: 1.5 }} className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></motion.div>
                                    <div className="relative z-10">
                                        <span className="text-white text-2xl font-black">{loading ? "جاري المعالجة..." : "تشغيل الفحص"}</span>
                                    </div>
                                    <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                                        {loading ? <RefreshCcw className="animate-spin text-[#b20e1e]" size={32} /> : <Zap className="text-[#b20e1e] fill-[#b20e1e]" size={32} />}
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {!result && !loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[600px] rounded-[3.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-bounce">
                                            {error ? <ShieldAlert size={60} className="text-red-500" /> : <ShieldCheck size={60} className="text-gray-800" />}
                                        </div>
                                        <h3 className={`text-3xl font-black mb-4 tracking-tighter ${error ? 'text-red-500' : 'text-gray-600'}`}>
                                            {error ? "حدث خطأ" : "بانتظار الأوامر..."}
                                        </h3>
                                        <p className="text-gray-700 max-w-sm mx-auto font-bold uppercase text-xs tracking-[2px]">
                                            {error ? error : "System Idle - Awaiting User Input For Neural Mapping"}
                                        </p>
                                    </motion.div>
                                )}

                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[600px] bg-[#000a2e] rounded-[3.5rem] border border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.1)] flex flex-col items-center justify-center p-16 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                            <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 2, repeat: Infinity }} className="w-1/3 h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></motion.div>
                                        </div>
                                        <div className="text-center space-y-10 relative z-10">
                                            <div className="flex justify-center gap-3">
                                                {[1, 2, 3].map(i => <motion.div key={i} animate={{ y: [0, -20, 0] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></motion.div>)}
                                            </div>
                                            <h3 className="text-5xl font-black text-white tracking-tighter">جاري فك الشفرة</h3>
                                            <div className="space-y-3">
                                                <p className="text-blue-400 font-black text-sm uppercase tracking-[5px]">
                                                    {analysisStep === 1 && "Browsing Trusted Databases..."}
                                                    {analysisStep === 2 && "Semantic Context Matching..."}
                                                    {analysisStep === 3 && "Analyzing News Patterns..."}
                                                    {analysisStep === 4 && "Finalizing Verdict..."}
                                                </p>
                                                <p className="text-gray-500 font-medium text-lg">نحن نبحث في أكثر من 5000 مصدر موثوق حول العالم..</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {result && !loading && (
                                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`h-full rounded-[4rem] bg-white shadow-2xl p-1 md:p-2 border-t-[24px] border-gradient-to-r ${config.color} ${config.shadow}`}>
                                        <div className="bg-white rounded-[3.8rem] p-10 md:p-16 h-full">
                                            {/* Final Verdict Card */}
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 bg-gray-50 rounded-[3.5rem] p-12 border border-gray-100 relative">
                                                <div className="flex items-center gap-10">
                                                    <div className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${config.color} text-white shadow-2xl transform -rotate-6`}>
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[5px] block mb-2">Verdict Status</span>
                                                        <h3 className={`text-7xl md:text-8xl font-black ${config.text} tracking-tighter`}>{verdictLabel}</h3>
                                                    </div>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[5px] block mb-4">Confidence Score</span>
                                                    <div className="flex items-baseline justify-center md:justify-end">
                                                        <span className="text-9xl font-black text-gray-900 leading-none tracking-tighter">{result.verdict?.confidence || result.confidence_score}</span>
                                                        <span className="text-3xl font-black text-gray-300">%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-12 mb-20 px-4">
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <BarChart className="text-[#b20e1e]" size={28} />
                                                        <h4 className="text-3xl font-black text-[#020617] tracking-tighter">التقرير التحليلي</h4>
                                                    </div>
                                                    <div className="text-2xl md:text-3xl leading-[1.8] text-gray-700 font-medium">
                                                        {result.verdict?.summary || result.summary}
                                                    </div>
                                                </div>

                                                {(result.verdict?.evidence || result.evidence) && (
                                                    <div className="p-10 bg-red-50 rounded-[3rem] border-r-[12px] border-[#b20e1e] relative overflow-hidden">
                                                        <ShieldAlert size={120} className="absolute -left-10 -top-10 text-red-600/5 rotate-12" />
                                                        <h5 className="text-[#b20e1e] font-black text-xs uppercase tracking-widest mb-4">الدليل القاطع</h5>
                                                        <p className="text-gray-800 text-xl md:text-2xl font-bold leading-relaxed relative z-10">{result.verdict?.evidence || result.evidence}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="px-4">
                                                <div className="flex items-center justify-between mb-10">
                                                    <div className="flex items-center gap-4">
                                                        <Globe className="text-blue-600" size={28} />
                                                        <h4 className="text-3xl font-black text-[#020617] tracking-tighter">المصادر الرقمية</h4>
                                                    </div>
                                                    <div className="h-px flex-grow mx-8 bg-gray-100 hidden md:block"></div>
                                                    <span className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full font-black text-[10px] uppercase tracking-widest">{result.sources?.length || 0} Sources Found</span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {(result.sources || []).map((source, idx) => (
                                                        <motion.a
                                                            key={idx} href={source.url} target="_blank" rel="noopener noreferrer"
                                                            whileHover={{ y: -10 }}
                                                            className="flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
                                                        >
                                                            <div className="flex flex-col gap-2 overflow-hidden">
                                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Verified Link</span>
                                                                <h5 className="text-xl font-black text-[#020617] truncate">{source.title}</h5>
                                                            </div>
                                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                <ExternalLink size={20} />
                                                            </div>
                                                        </motion.a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
