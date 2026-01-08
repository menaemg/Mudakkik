import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ auth, status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="تأكيد البريد الإلكتروني" />

            <div className="min-h-screen flex items-center justify-center bg-[#000a2e] p-4 overflow-hidden" dir="rtl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Decorative blurs */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl" />
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="w-full max-w-lg relative z-10">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-red-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                                <span className="font-black text-2xl text-white pb-0.5">مـ</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-2xl font-black text-white">
                                    مدقق <span className="text-brand-red">.</span>
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">نيوز</span>
                            </div>
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-100 text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-6">
                            <Mail className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold text-[#000a2e] mb-2">
                            تأكيد البريد الإلكتروني
                        </h1>
                        <p className="text-slate-500 mb-6">
                            خطوة أخيرة لتفعيل حسابك بالكامل
                        </p>

                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <p className="text-sm font-bold text-emerald-800 text-right">
                                    تم إرسال رابط التحقق الجديد إلى بريدك الإلكتروني بنجاح.
                                </p>
                            </div>
                        )}

                        <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
                            <p className="text-slate-600 leading-relaxed">
                                شكراً لتسجيلك! قبل البدء، يرجى تأكيد بريدك الإلكتروني
                                من خلال النقر على الرابط الذي أرسلناه إليك.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#000a2e] text-white font-bold rounded-xl hover:bg-[#001246] transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                            >
                                <RefreshCw className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
                                {processing ? 'جاري الإرسال...' : 'إعادة إرسال رابط التحقق'}
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full py-3 text-slate-500 font-bold hover:text-brand-red transition-colors flex items-center justify-center gap-2 rounded-xl hover:bg-slate-50"
                            >
                                <LogOut className="w-4 h-4" />
                                تسجيل الخروج
                            </Link>
                        </form>

                        <p className="mt-6 text-xs font-medium text-slate-400">
                            لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
                        </p>
                    </div>

                    {/* Back to Home */}
                    <p className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                            ← العودة للصفحة الرئيسية
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
