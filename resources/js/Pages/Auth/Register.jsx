import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FaNewspaper, FaShieldAlt, FaCheckCircle, FaGift } from 'react-icons/fa';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="إنشاء حساب" />

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
                            انضم إلى مجتمع الحقيقة
                        </h2>
                        <p className="text-gray-400 text-center max-w-sm mb-12">
                            سجل الآن واحصل على وصول مجاني لجميع الأخبار وأدوات التحقق
                        </p>

                        {/* Features */}
                        <div className="space-y-4 w-full max-w-xs">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaGift className="text-brand-red" />
                                </div>
                                <span className="text-sm">تسجيل مجاني بالكامل</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaShieldAlt className="text-brand-red" />
                                </div>
                                <span className="text-sm">رصيد مجاني للتحقق من الأخبار</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaNewspaper className="text-brand-red" />
                                </div>
                                <span className="text-sm">وصول لجميع المقالات</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FaCheckCircle className="text-brand-red" />
                                </div>
                                <span className="text-sm">إشعارات الأخبار العاجلة</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000a2e] to-transparent" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl" />
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 py-12">
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
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-[#000a2e]">إنشاء حساب جديد</h1>
                                <p className="text-slate-500 mt-1 text-sm">انضم إلينا في ثوانٍ معدودة</p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="أحمد محمد"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-1.5" />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        اسم المستخدم
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="ahmed_m"
                                        dir="ltr"
                                        required
                                    />
                                    <InputError message={errors.username} className="mt-1.5" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="example@email.com"
                                        dir="ltr"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1.5" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        كلمة المرور
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50 pl-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1.5" />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        تأكيد كلمة المرور
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 mt-2"
                                >
                                    {processing ? 'جاري التسجيل...' : 'إنشاء حساب'}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-600">
                                    لديك حساب بالفعل؟{' '}
                                    <Link href={route('login')} className="text-brand-red font-bold hover:text-red-700 transition-colors">
                                        تسجيل الدخول
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
