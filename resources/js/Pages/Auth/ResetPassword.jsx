import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="إعادة تعيين كلمة المرور" />

            <div className="min-h-screen flex items-center justify-center bg-[#000a2e] p-4 overflow-hidden" dir="rtl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Decorative blurs */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
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
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-4">
                                <Lock className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-[#000a2e]">إعادة تعيين كلمة المرور</h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                أدخل كلمة المرور الجديدة
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
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
                                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-100"
                                        dir="ltr"
                                        readOnly
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    كلمة المرور الجديدة
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50 pl-12"
                                        placeholder="••••••••"
                                        autoFocus
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    تأكيد كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-slate-900 bg-slate-50"
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
                            >
                                {processing ? 'جاري الحفظ...' : 'إعادة تعيين كلمة المرور'}
                            </button>
                        </form>
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
