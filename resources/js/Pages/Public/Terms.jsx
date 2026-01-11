import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, ChevronLeft, Shield, BookOpen, Scale, Info } from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Terms({ auth, ticker, policies }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <>
            <Head title="السياسات والقوانين - مدقق نيوز" />

            <div className="min-h-screen bg-[#F4F7FA] text-right flex flex-col" dir="rtl">
                <Header auth={auth} ticker={ticker} />

                <main className="flex-1 py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            
                            <div className="w-full md:w-1/3 lg:w-1/4">
                                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-4 sticky top-28">
                                    <div className="p-4 mb-4 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-[#001246] flex items-center gap-2">
                                            <Scale className="text-red-600" size={20} />
                                            قائمة السياسات
                                        </h3>
                                    </div>
                                    <nav className="space-y-2">
                                        {policies.map((policy, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveTab(index)}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                                    activeTab === index 
                                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                                                    : 'hover:bg-slate-50 text-slate-600 font-bold'
                                                }`}
                                            >
                                                <span className="text-sm">{policy.type}</span>
                                                <ChevronLeft size={16} className={activeTab === index ? 'opacity-100' : 'opacity-0'} />
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden min-h-[500px]"
                                    >
                                        <div className="h-2 bg-red-600 w-full"></div>
                                        <div className="p-8 md:p-12">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                                                    <BookOpen size={28} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-[#001246]">
                                                        {policies[activeTab]?.type}
                                                    </h2>
                                                    <p className="text-slate-400 text-sm font-bold mt-1">تاريخ التحديث: {new Date().toLocaleDateString('ar-EG')}</p>
                                                </div>
                                            </div>

                                            <div className="prose prose-slate max-w-none">
                                                <p className="text-slate-600 leading-[2] font-medium whitespace-pre-line text-lg">
                                                    {policies[activeTab]?.content}
                                                </p>
                                            </div>

                                            <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                                                <Info className="text-blue-600 shrink-0" size={24} />
                                                <p className="text-blue-800 text-sm leading-relaxed">
                                                    إذا كان لديك أي استفسار حول هذه السياسة، يرجى التواصل مع الدعم الفني عبر صفحة "اتصل بنا".
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}