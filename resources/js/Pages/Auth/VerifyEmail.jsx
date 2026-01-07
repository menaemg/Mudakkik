import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ auth, status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans" dir="rtl">
            <Head title="تأكيد البريد الإلكتروني" />
            <Header auth={auth} />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-xl w-full">

                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/2 translate-y-1/2"></div>

                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-blue-500/20 mb-8 rotate-3 transition-transform hover:rotate-6">
                            <Mail className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-3xl font-black text-[#020617] mb-3">
                            تأكيد البريد الإلكتروني
                        </h1>
                        <p className="text-lg text-gray-500 font-medium mb-8">
                            خطوة أخيرة لتفعيل حسابك بالكامل
                        </p>

                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <p className="text-sm font-bold text-emerald-800 text-right">
                                    تم إرسال رابط التحقق الجديد إلى بريدك الإلكتروني بنجاح.
                                </p>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                شكراً لتسجيلك! قبل البدء، يرجى تأكيد بريدك الإلكتروني
                                من خلال النقر على الرابط الذي أرسلناه إليك.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-[#020617] hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                            >
                                <RefreshCw className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
                                {processing ? 'جاري الإرسال...' : 'إعادة إرسال رابط التحقق'}
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full py-4 text-gray-500 font-bold hover:text-[#b20e1e] transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                تسجيل الخروج
                            </Link>
                        </form>

                        <p className="mt-8 text-xs font-bold text-gray-400">
                            لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam).
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
