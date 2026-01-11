import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, Minus, MessageSquare, ChevronLeft, PenTool, Megaphone } from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function FAQ({ auth, ticker }) {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "كيف يمكنني نشر مقال أو تقرير في مدقق نيوز؟",
            icon: <PenTool size={20} />,
            answer: "للنشر في منصتنا، يجب أولاً امتلاك حساب 'صحفي'. بعد تسجيل الدخول، يمكنك استخدام أدوات إنشاء المقالات وإرسالها للمراجعة. سيقوم فريق التحرير بالتدقيق، وسيصلك إشعار فوري على حسابك في كل الحالات (قبول، تعديل، أو رفض)."
        },
        {
            question: "كيف أعلن عن نشاطي التجاري عبر المنصة؟",
            icon: <Megaphone size={20} />,
            answer: "نوفر باقات إعلانية متنوعة تناسب كافة الاحتياجات. يمكنك اختيار الباقة التي تناسبك وإرسال بيانات الإعلان مباشرة من خلال البروفايل الخاص بك، وسيقوم فريقنا بالرد عليك ومتابعة الطلب عبر لوحة التحكم الخاصة بك."
        },
        {
            question: "هل أخبار منصة مدقق نيوز موثقة؟",
            icon: <HelpCircle size={20} />,
            answer: "نعم، نلتزم بأعلى معايير المهنية. كل خبر يتم نشره يمر بمرحلة التدقيق والتحقق من المصادر لضمان تقديم معلومة صحيحة تماماً للقارئ."
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
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex p-4 rounded-3xl bg-red-600 shadow-xl shadow-red-200 text-white mb-6"
                            >
                                <HelpCircle size={40} />
                            </motion.div>
                            <h1 className="text-4xl font-black text-[#001246] mb-4">الأسئلة الشائعة</h1>
                            <p className="text-slate-500 font-bold">كل ما تحتاج لمعرفته حول نظام النشر والإعلان في مدقق</p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group hover:border-red-100 transition-all"
                                >
                                    <button 
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full p-6 flex items-center justify-between text-right"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-xl transition-colors ${openIndex === index ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {faq.icon}
                                            </div>
                                            <span className={`text-lg font-black transition-colors ${openIndex === index ? 'text-red-600' : 'text-[#001246]'}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        <div className={`shrink-0 p-1 rounded-full transition-all ${openIndex === index ? 'bg-red-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                            {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-8 pt-0 text-slate-600 leading-[1.8] font-medium border-t border-slate-50 bg-slate-50/30">
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
                            whileInView={{ opacity: 1 }}
                            className="mt-20 bg-[#001246] rounded-[40px] p-10 md:p-16 text-center text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            
                            <div className="relative z-10">
                                <MessageSquare className="mx-auto mb-6 text-red-500" size={54} />
                                <h2 className="text-3xl font-black mb-4">هل ما زال لديك استفسار؟</h2>
                                <p className="text-slate-300 font-bold mb-10 text-lg">يسعدنا دائماً استقبال استفساراتكم عبر نموذج التواصل المباشر.</p>
                                <Link 
                                    href="/contact" 
                                    className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-xl shadow-red-600/30 hover:scale-105"
                                >
                                    تواصل معنا الآن
                                    <ChevronLeft size={20} />
                                </Link>
                            </div>
                        </motion.div>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}