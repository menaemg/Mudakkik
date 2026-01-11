import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, Minus, MessageSquare, Search } from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function FAQ({ auth, ticker }) {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "كيف يمكنني المساهمة في نشر الأخبار عبر منصة مدقق؟",
            answer: "يمكنك التواصل مع فريق التحرير عبر صفحة 'اتصل بنا' وإرسال مقالاتك أو تقاريرك. سنقوم بمراجعتها والتأكد من توافقها مع معايير الدقة والموضوعية لدينا قبل النشر."
        },
        {
            question: "هل أخبار منصة مدقق نيوز موثقة؟",
            answer: "نعم، نلتزم في مدقق نيوز بأعلى معايير المهنية. كل خبر يتم نشره يمر بمرحلة التدقيق والتحقق من المصادر لضمان تقديم معلومة صحيحة تماماً للقارئ."
        },
        {
            question: "كيف أستطيع الإعلان عبر المنصة؟",
            answer: "لدينا باقات إعلانية متنوعة تناسب الجميع. يمكنك مراسلتنا عبر البريد المخصص للإعلانات أو ملء نموذج التواصل في صفحة اتصل بنا."
        },
        {
            question: "هل تتوفر نسخة من الموقع للهواتف الذكية؟",
            answer: "الموقع مصمم بتقنية Responsive التي تجعله يعمل بكفاءة عالية على كافة أحجام الشاشات، كما أننا نعمل حالياً على إطلاق التطبيق الرسمي قريباً."
        }
    ];

    return (
        <>
            <Head title="الأسئلة الشائعة - مدقق نيوز" />
            <div className="min-h-screen bg-[#F8FAFF] text-right flex flex-col" dir="rtl">
                <Header auth={auth} ticker={ticker} />

                <main className="flex-1 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto px-6">
                        
                        <div className="text-center mb-16">
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-flex p-4 rounded-3xl bg-blue-50 text-[#001246] mb-6 shadow-sm"
                            >
                                <HelpCircle size={40} />
                            </motion.div>
                            <h1 className="text-4xl font-black text-[#001246] mb-4">الأسئلة الشائعة</h1>
                            <p className="text-slate-500 font-bold">كل ما تحتاج لمعرفته حول منصة مدقق في مكان واحد</p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                                >
                                    <button 
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full p-6 flex items-center justify-between text-right transition-colors hover:bg-slate-50"
                                    >
                                        <span className={`text-lg font-black transition-colors ${openIndex === index ? 'text-red-600' : 'text-[#001246]'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`shrink-0 p-2 rounded-full transition-all ${openIndex === index ? 'bg-red-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                            {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 pt-0 text-slate-600 leading-relaxed font-medium border-t border-slate-50 bg-slate-50/30">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 bg-[#001246] rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <MessageSquare className="mx-auto mb-6 text-red-500" size={48} />
                                <h2 className="text-2xl font-black mb-4">لم تجد إجابة لسؤالك؟</h2>
                                <p className="text-slate-300 font-bold mb-8">فريقنا متاح دائماً للإجابة على كافة استفساراتكم التقنية والتحريرية.</p>
                                <a 
                                    href="/contact" 
                                    className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-600/20"
                                >
                                    تواصل معنا الآن
                                </a>
                            </div>
                        </motion.div>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}