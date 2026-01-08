import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { KeyRound, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="نسيت كلمة المرور" />

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

                <div className="w-full max-w-md relative z-10">
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
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg mb-4">
                                <KeyRound className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-[#000a2e]">نسيت كلمة المرور؟</h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة التعيين
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">
                                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="example@email.com"
                                        dir="ltr"
                                        autoFocus
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#000a2e] text-white font-bold rounded-xl hover:bg-[#001246] transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {processing ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <Link
                            href={route('login')}
                            className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-brand-red transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة لتسجيل الدخول
                        </Link>
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
