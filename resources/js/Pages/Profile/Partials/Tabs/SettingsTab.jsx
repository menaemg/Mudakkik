import React from 'react';
import UpdateProfileInformation from '../UpdateProfileInformationForm';
import UpdatePasswordForm from '../UpdatePasswordForm';
import DeleteUserForm from '../DeleteUserForm';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

export default function SettingsTab({ mustVerifyEmail, status }) {
    const { upgrade_request_status, auth } = usePage().props;
    const user = auth.user;
    const isNormalUser = user.role === 'user';

    const { data, setData, post, processing, errors } = useForm({
        document: null,
        message: '',
    });

    const submitUpgradeRequest = (e) => {
        e.preventDefault();
        post(route('upgrade.store'));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">

            {isNormalUser && (
                <div className="bg-gradient-to-r from-[#000a2e] to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden mb-8">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-right">
                            <h3 className="text-2xl font-black mb-2 flex items-center justify-center md:justify-start gap-2">
                                <FaUserShield className="text-yellow-400" />
                                انضم لفريق الصحفيين
                            </h3>
                            <p className="text-white/80 text-sm max-w-lg leading-relaxed font-medium">
                                هل لديك شغف بالكتابة؟ قم بترقية حسابك الآن لتتمكن من نشر المقالات والأخبار، والحصول على شارة التوثيق، وزيادة مصداقيتك.
                            </p>
                        </div>

                        <div>
                        {!upgrade_request_status && (
                        <form onSubmit={submitUpgradeRequest} className="mt-4 space-y-4 text-right">
                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-1">رسالة الطلب</label>
                                <textarea
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-yellow-400"
                                    placeholder="لماذا تريد الانضمام إلينا؟"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-1">السيرة الذاتية / نموذج عمل (PDF)</label>
                                <input
                                    type="file"
                                    onChange={e => setData('document', e.target.files[0])}
                                    className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
                                />
                                {errors.document && <p className="text-red-300 text-xs mt-1">{errors.document}</p>}
                            </div>
                            <Button disabled={processing} className="bg-yellow-500 text-black font-bold w-full">
                                إرسال الطلب
                            </Button>
                        </form>
                    )}
                            {upgrade_request_status === 'pending' && (
                                <div className="flex flex-col items-center bg-white/10 px-6 py-3 rounded-xl border border-white/20">
                                    <FaHourglassHalf className="text-yellow-400 text-xl mb-1 animate-pulse" />
                                    <span className="font-bold text-sm">طلبك قيد المراجعة</span>
                                </div>
                            )}

                            {upgrade_request_status === 'rejected' && (
                                <div className="flex flex-col items-center bg-red-500/20 px-6 py-3 rounded-xl border border-red-500/50">
                                    <FaTimesCircle className="text-red-400 text-xl mb-1" />
                                    <span className="font-bold text-sm">تم رفض الطلب السابق</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>
                </div>
            )}

            <div className="p-4 sm:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                <UpdateProfileInformation
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </div>

            <div className="p-4 sm:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="p-4 sm:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                <DeleteUserForm className="max-w-xl" />
            </div>
        </div>
    );
}
