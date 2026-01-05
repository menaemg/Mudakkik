import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="تسجيل الدخول" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4" dir="rtl">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-block mb-6">
                                <span className="text-3xl font-bold text-indigo-600">مدقق</span>
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900">تسجيل الدخول</h1>
                            <p className="text-slate-500 mt-1 text-sm">مرحباً بعودتك</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-3 rounded-lg bg-green-50 text-green-700 text-sm text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                                    placeholder="example@email.com"
                                    autoFocus
                                />
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 pl-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                    />
                                    <span className="mr-2 text-slate-600">تذكرني</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-indigo-600 hover:text-indigo-700">
                                        نسيت كلمة المرور؟
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'جاري الدخول...' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="mt-6 text-center text-sm text-slate-600">
                            ليس لديك حساب؟{' '}
                            <Link href={route('register')} className="text-indigo-600 font-medium hover:text-indigo-700">
                                إنشاء حساب
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
