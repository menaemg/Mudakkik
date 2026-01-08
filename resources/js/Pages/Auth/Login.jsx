import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FaNewspaper, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

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

            <div className="min-h-screen flex" dir="rtl">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#000a2e] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 mb-12 group">
                            <div className="w-14 h-14 bg-gradient-to-br from-brand-red to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:rotate-6 transition-transform border border-white/10">
                                <span className="font-black text-3xl text-white pb-1">مـ</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black text-white leading-none tracking-tight">
                                    مدقق <span className="text-brand-red">.</span>
                                </h1>
                                <span className="text-xs font-bold text-gray-400 tracking-[0.2em]">
                                    نيوز
                                </span>
                            </div>
                        </Link>

                        {/* Tagline */}
                        <h2 className="text-2xl font-bold text-white text-center mb-4">
                            منصة الأخبار الموثوقة
                        </h2>
                        <p className="text-gray-400 text-center max-w-sm mb-12">
                            انضم إلى مجتمع من القراء الباحثين عن الحقيقة والأخبار الدقيقة
                        </p>

                        {/* Features */}
                        <div className="space-y-4 w-full max-w-xs">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaNewspaper className="text-brand-red" />
                                </div>
                                <span className="text-sm">أخبار موثوقة ومحدثة</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaShieldAlt className="text-brand-red" />
                                </div>
                                <span className="text-sm">تحقق من صحة الأخبار بالذكاء الاصطناعي</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaCheckCircle className="text-brand-red" />
                                </div>
                                <span className="text-sm">محتوى حصري للمشتركين</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000a2e] to-transparent" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl" />
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-red-700 rounded-xl flex items-center justify-center">
                                    <span className="font-black text-xl text-white">مـ</span>
                                </div>
                                <span className="text-2xl font-black text-[#000a2e]">
                                    مدقق <span className="text-brand-red">.</span>
                                </span>
                            </Link>
                        </div>

                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-[#000a2e]">تسجيل الدخول</h1>
                                <p className="text-slate-500 mt-1 text-sm">مرحباً بعودتك إلى مدقق نيوز</p>
                            </div>

                            {status && (
                                <div className="mb-6 p-3 rounded-xl bg-green-50 text-green-700 text-sm text-center border border-green-100">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="example@email.com"
                                        autoFocus
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        كلمة المرور
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50 pl-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 text-brand-red rounded border-slate-300 focus:ring-brand-red/20"
                                        />
                                        <span className="mr-2 text-slate-600 group-hover:text-slate-900 transition-colors">تذكرني</span>
                                    </label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-brand-red hover:text-red-700 font-medium transition-colors">
                                            نسيت كلمة المرور؟
                                        </Link>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-[#000a2e] text-white font-bold rounded-xl hover:bg-[#001246] transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {processing ? 'جاري الدخول...' : 'تسجيل الدخول'}
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-600">
                                    ليس لديك حساب؟{' '}
                                    <Link href={route('register')} className="text-brand-red font-bold hover:text-red-700 transition-colors">
                                        إنشاء حساب جديد
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <p className="mt-6 text-center">
                            <Link href="/" className="text-sm text-slate-500 hover:text-[#000a2e] transition-colors">
                                ← العودة للصفحة الرئيسية
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
