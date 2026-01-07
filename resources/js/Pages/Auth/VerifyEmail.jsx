import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="تأكيد البريد الإلكتروني" />

            <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    {/* Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-6">
                            <Mail className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            تأكيد البريد الإلكتروني
                        </h1>
                        <p className="text-gray-600">
                            خطوة واحدة لتفعيل حسابك
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">
                                    تم إرسال رابط التحقق الجديد إلى بريدك الإلكتروني بنجاح.
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-gray-700 text-center leading-relaxed">
                                شكراً لتسجيلك! قبل البدء، يرجى تأكيد بريدك الإلكتروني
                                من خلال النقر على الرابط الذي أرسلناه إليك.
                            </p>
                        </div>

                        {/* Resend Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <RefreshCw className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
                                {processing ? 'جاري الإرسال...' : 'إعادة إرسال رابط التحقق'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-4 text-sm text-gray-400">أو</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Logout */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-gray-600 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                        </Link>

                        {/* Help Text */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
