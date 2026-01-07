import React, { useState } from 'react';
import UpdateProfileInformation from '../UpdateProfileInformationForm';
import UpdatePasswordForm from '../UpdatePasswordForm';
import DeleteUserForm from '../DeleteUserForm';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUserTie } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import JoinJournalistModal from '@/Components/JoinJournalistModal';

export default function SettingsTab({ mustVerifyEmail, status }) {
    const { upgrade_request_status, auth } = usePage().props;
    const user = auth.user;
    const isNormalUser = user.role === 'user';
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">

            <JoinJournalistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-lg gap-2 h-11 px-6 text-base font-bold transition-transform hover:scale-105"
                                >
                                    <FaUserTie /> قدم طلب الانضمام
                                </Button>
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
