import React, { useState } from 'react';
import UpdateProfileInformation from '../UpdateProfileInformationForm';
import UpdatePasswordForm from '../UpdatePasswordForm';
import DeleteUserForm from '../DeleteUserForm';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaFileUpload } from 'react-icons/fa';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';
import JoinJournalistModal from '@/Components/JoinJournalistModal';

export default function SettingsTab({ mustVerifyEmail, status }) {
    const { upgrade_request_status, auth } = usePage().props;
    const user = auth.user;
    const isNormalUser = user.role === 'user';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        document: null,
    });

    const submitUpgradeRequest = (e) => {
        e.preventDefault();
        post(route('upgrade-requests.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'تم إرسال الطلب',
                    text: 'سيقوم المسؤولون بمراجعة طلبك والرد عليك قريباً.',
                    confirmButtonColor: '#000a2e'
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'يرجى التأكد من إدخال البيانات بشكل صحيح.',
                });
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 flex flex-col min-h-[calc(100vh-16rem)] h-full">

            <JoinJournalistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {isNormalUser && (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#000a2e] to-[#1e293b] p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20 border border-white/10 shrink-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-4">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg mb-2">
                                <FaUserShield className="text-yellow-400 text-2xl" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">انضم لفريق الصحفيين</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-lg font-medium">
                                هل لديك شغف بالكتابة؟ قم بترقية حسابك الآن لتتمكن من نشر المقالات والأخبار، والحصول على شارة التوثيق، وزيادة مصداقيتك أمام الجمهور.
                            </p>

                            {upgrade_request_status === 'pending' && (
                                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-500/30 font-bold text-sm mt-4">
                                    <FaHourglassHalf className="animate-pulse" /> طلبك قيد المراجعة حالياً
                                </div>
                            )}
                            {upgrade_request_status === 'rejected' && (
                                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/30 font-bold text-sm mt-4">
                                    <FaTimesCircle /> تم رفض الطلب السابق (حاول مرة أخرى)
                                </div>
                            )}
                        </div>

                        {!upgrade_request_status && (
                            <div className="lg:w-[450px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
                                <form onSubmit={submitUpgradeRequest} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">رسالة الطلب</label>
                                        <textarea
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className="w-full rounded-xl bg-[#000a2e]/50 border-white/10 text-white placeholder-white/30 focus:ring-yellow-500/50 focus:border-yellow-500 min-h-[100px] text-sm p-4"
                                            placeholder="أخبرنا قليلاً عن خبرتك ولماذا تود الانضمام إلينا..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">السيرة الذاتية (PDF)</label>
                                        <div className="relative border border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors p-4 cursor-pointer group text-center">
                                            <input
                                                type="file"
                                                onChange={e => setData('document', e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center gap-2 pointer-events-none">
                                                <FaFileUpload className="text-yellow-500 text-xl group-hover:scale-110 transition-transform" />
                                                <span className="text-xs text-gray-300 font-bold">
                                                    {data.document ? <span className="text-yellow-400">{data.document.name}</span> : 'اضغط لرفع الملف'}
                                                </span>
                                            </div>
                                        </div>
                                        {errors.document && <p className="text-red-400 text-xs font-bold mt-1">{errors.document}</p>}
                                    </div>

                                    <Button disabled={processing} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-[#000a2e] font-black py-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                                        {processing ? 'جاري الإرسال...' : 'إرسال طلب الانضمام'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-6 flex-grow">
                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-[2.5rem]">
                    <div className="mb-6 pb-4 border-b border-gray-50">
                        <h4 className="text-lg font-black text-gray-900">المعلومات الشخصية</h4>
                        <p className="text-gray-500 text-sm">تحديث بيانات حسابك وعنوان البريد الإلكتروني.</p>
                    </div>
                    <UpdateProfileInformation
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-[2.5rem]">
                    <div className="mb-6 pb-4 border-b border-gray-50">
                        <h4 className="text-lg font-black text-gray-900">الأمان وكلمة المرور</h4>
                        <p className="text-gray-500 text-sm">تأكد من استخدام كلمة مرور قوية للحفاظ على أمان حسابك.</p>
                    </div>
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-[2.5rem]">
                    <div className="mb-6 pb-4 border-b border-gray-50">
                        <h4 className="text-lg font-black text-red-600">منطقة الخطر</h4>
                        <p className="text-gray-500 text-sm">حذف الحساب إجراء نهائي لا يمكن التراجع عنه.</p>
                    </div>
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </div>
    );
}
