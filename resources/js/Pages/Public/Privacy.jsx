import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cookie, UserCheck, MessageCircle, Mail, AlertCircle, ChevronLeft } from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Privacy({ auth, ticker }) {
    const cardVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
        })
    };

    return (
        <>
            <Head title="سياسة الخصوصية - مدقق نيوز" />
            <div className="min-h-screen bg-[#F4F7FA] text-right flex flex-col" dir="rtl">
                <Header auth={auth} ticker={ticker} />

                <main className="flex-1 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto px-6">
                        
                        <div className="text-center mb-16">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex p-4 rounded-full bg-red-600 shadow-xl shadow-red-200 text-white mb-6"
                            >
                                <ShieldCheck size={40} />
                            </motion.div>
                            <h1 className="text-4xl font-black text-[#001246] mb-4">سياسة الخصوصية</h1>
                            <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
                                عزيزي المستخدم، نحن نولي اهتماماً فائقاً لخصوصيتك في منصة "مدقق نيوز".
                            </p>
                        </div>

                        <div className="space-y-6">
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-4 mb-4 text-red-600">
                                    <AlertCircle size={24} />
                                    <h2 className="text-xl font-black text-[#001246]">ملاحظة هامة</h2>
                                </div>
                                <p className="text-slate-600 leading-[1.8] font-medium">
                                    سياسة الخصوصية متغيرة، ويمكن تطبيق أى تغيرات عليها فى أى وقت، لذا يرجى مراجعة هذه الصفحة بشكل دورى.
                                </p>
                            </motion.div>

                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-4 mb-4 text-[#001246]">
                                    <Cookie size={24} className="text-red-600" />
                                    <h2 className="text-xl font-black">ملفات تعريف الارتباط (Cookies)</h2>
                                </div>
                                <p className="text-slate-600 leading-[1.8] font-medium">
                                    يتم جمع البيانات تلقائياً من خلال الكوكيز لحفظ المعلومات الأساسية التي يستخدمها موقع "مدقق نيوز" لتحسين تجربة المستخدم واستهداف الإعلانات بفعالية.
                                </p>
                            </motion.div>

                            <motion.div 
                                custom={3} 
                                variants={cardVariants} 
                                initial="hidden" 
                                animate="visible" 
                                className="bg-[#001246] p-8 rounded-[32px] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/10 rounded-2xl text-red-500">
                                            <Mail size={24} />
                                        </div>
                                        <h2 className="text-xl font-black">هل لديك استفسار؟</h2>
                                    </div>
                                    <p className="leading-[1.8] font-bold opacity-90 mb-6 max-w-xl">
                                        إذا كان لديك أسئلة عن سياسة الخصوصية، يسعدنا مساعدتك عبر التواصل معنا مباشرة.
                                    </p>
                                    <Link 
                                        href="/contact" 
                                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg"
                                    >
                                        اتصل بنا الآن
                                        <ChevronLeft size={20} />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}