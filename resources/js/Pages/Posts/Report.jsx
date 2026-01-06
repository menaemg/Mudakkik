import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    AlertTriangle,
    Send,
    X,
    ShieldAlert,
    FileText,
    ChevronRight,
    Siren
} from 'lucide-react';

export default function Report({ auth, post }) {

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const { data, setData, post: submit, processing, errors } = useForm({
        reason: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        submit(route('posts.report.store', post.id));
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">
            <Head title={`الإبلاغ عن: ${post.title}`} />

            <Header auth={auth} />

            <main className="flex-grow">

                <div className="relative pt-40 pb-36 md:pb-52 overflow-hidden bg-[#020617]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="absolute left-0 top-20 w-[500px] h-[500px] bg-[#b20e1e]/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                    <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">

                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-8 backdrop-blur-md shadow-2xl animate-bounce" data-aos="fade-down">
                            <Siren size={16} className="animate-pulse" />
                            <span className="tracking-wider">منطقة البلاغات</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg tracking-tight" data-aos="fade-up">
                            ساعدنا في تنظيف مجتمعنا الصحفي من الأخبار الزائفة او المضللة
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed" data-aos="fade-up" data-aos-delay="100">
                            نحن نعتمد على وعيك. إذا رأيت محتوى يخالف المعايير، لا تتردد في إبلاغنا فوراً ليتم اتخاذ الإجراء اللازم.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 -mt-24 md:-mt-36 relative z-20 mb-24" data-aos="zoom-in" data-aos-duration="1000">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#020617]/40 border-[8px] border-white bg-white relative">

                        <div className="bg-gray-50/80 p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                             <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white flex items-center justify-center group relative transform rotate-3">
                                {post.image ? (
                                    <img
                                        src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt="post thumbnail"
                                    />
                                ) : (
                                    <FileText className="text-gray-300" size={32} />
                                )}
                            </div>

                            <div className="text-center sm:text-right flex-1">
                                <div className="inline-flex items-center gap-2 mb-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                        يتم الإبلاغ عن
                                    </p>
                                </div>
                                <h2 className="text-gray-900 font-black text-xl md:text-2xl line-clamp-2 leading-snug mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-xs font-bold text-gray-400">
                                    الناشر: <span className="text-gray-700">{post.user?.name || 'مستخدم'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <form onSubmit={submitForm} className="space-y-8">

                                <div>
                                    <label className="flex items-center justify-between mb-4">
                                        <span className="text-gray-800 font-black text-lg flex items-center gap-2">
                                            <AlertTriangle className="text-rose-500" size={20} />
                                            سبب المخالفة
                                        </span>
                                    </label>

                                    <div className="relative group">
                                        <textarea
                                            className={`w-full border-2 rounded-3xl p-6 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-gray-700 placeholder:text-gray-400 resize-none min-h-[220px] font-medium text-base leading-relaxed shadow-inner
                                            ${errors.reason ? 'border-rose-300 focus:border-rose-500' : 'border-gray-100 focus:border-[#b20e1e] group-hover:border-gray-200'}`}
                                            placeholder="اكتب هنا تفاصيل المشكلة... (مثال: محتوى كاذب، عنف، خطاب كراهية، حقوق ملكية...)"
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        <div className="absolute bottom-6 left-6 text-gray-300 group-hover:text-rose-500 transition-colors pointer-events-none">
                                            <ShieldAlert size={24} />
                                        </div>
                                    </div>

                                    {errors.reason && (
                                        <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-3 rounded-2xl text-sm font-bold w-fit animate-pulse border border-rose-100">
                                            <X size={16} />
                                            {errors.reason}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                    <Link
                                        href={route('posts.show', post.slug || post.id)}
                                        className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <ChevronRight size={20} />
                                        إلغاء
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-gradient-to-r from-[#b20e1e] to-rose-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-rose-900/20 hover:shadow-rose-600/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group active:scale-95"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>جاري المعالجة...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>إرسال البلاغ</span>
                                                <Send size={20} className="group-hover:-translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
