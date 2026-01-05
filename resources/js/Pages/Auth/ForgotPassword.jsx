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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4" dir="rtl">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg mb-6">
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <Link href="/" className="inline-block mb-4">
                                <span className="text-3xl font-bold text-indigo-600">مدقق</span>
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900">نسيت كلمة المرور؟</h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                لا مشكلة! أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">
                                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                                        placeholder="example@email.com"
                                        autoFocus
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {processing ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <Link
                            href={route('login')}
                            className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
