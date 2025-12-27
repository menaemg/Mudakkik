import { Head, Link } from "@inertiajs/react";

export default function Welcome({ canLogin, canRegister, auth }) {
    return (
        <>
            <Head title="مرحباً - مدقق" />

            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">مدقق</h1>
                        <div className="flex gap-4 items-center">
                            {auth?.user ? (
                                <>
                                    <span className="text-blue-200">مرحباً، {auth.user.name}</span>
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition"
                                    >
                                        لوحة التحكم
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="px-6 py-2 text-white hover:text-red-300 transition"
                                    >
                                        تسجيل الخروج
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2 text-white hover:text-blue-200 transition"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition"
                                        >
                                            إنشاء حساب
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-6 pt-32 pb-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            منصة التحقق من الأخبار
                            <span className="block text-blue-300">والمعلومات</span>
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            انضم إلى مجتمع المدققين وساهم في مكافحة المعلومات المضللة
                            وبناء مصادر موثوقة للأخبار
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg shadow-blue-900/30"
                                >
                                    ابدأ الآن مجاناً
                                </Link>
                            )}
                            {auth?.user && (
                                <Link
                                    href={route('plans.index')}
                                    className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition"
                                >
                                    عرض الخطط
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8 mt-24">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">تحقق موثوق</h3>
                            <p className="text-blue-200">
                                نظام تحقق متعدد المراحل لضمان دقة المعلومات
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">مجتمع نشط</h3>
                            <p className="text-blue-200">
                                انضم إلى آلاف المدققين والصحفيين الموثوقين
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">سريع وفعال</h3>
                            <p className="text-blue-200">
                                أدوات متقدمة للتحقق السريع من المعلومات
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8">
                    <div className="container mx-auto px-6 text-center text-blue-300">
                        <p>© {new Date().getFullYear()} مدقق - جميع الحقوق محفوظة</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
