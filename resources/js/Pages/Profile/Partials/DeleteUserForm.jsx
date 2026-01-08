import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`relative overflow-hidden bg-red-50 rounded-[2rem] border border-red-100 p-8 ${className}`}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <header className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
                    <FaExclamationTriangle size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-900">
                        حذف الحساب نهائياً
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 font-medium max-w-xl leading-relaxed">
                        بمجرد حذف حسابك، سيتم حذف جميع الموارد والبيانات المرتبطة به نهائيًا. قبل الحذف، يرجى تنزيل أي بيانات ترغب في الاحتفاظ بها، لأن هذا الإجراء لا يمكن التراجع عنه.
                    </p>
                </div>
            </header>

            <div className="mt-8 flex justify-end relative z-10">
                <DangerButton onClick={confirmUserDeletion} className="px-6 py-3 rounded-xl shadow-lg shadow-red-500/20 font-bold text-sm transition-transform hover:-translate-y-0.5 flex items-center gap-2">
                    <FaTrashAlt /> حذف الحساب
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 text-right bg-white rounded-[2rem]" dir="rtl">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <FaExclamationTriangle size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">
                            هل أنت متأكد تماماً؟
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            بمجرد حذف حسابك، سيتم حذف جميع الموارد والبيانات نهائيًا. يرجى إدخال كلمة المرور لتأكيد رغبتك في حذف الحساب بشكل دائم.
                        </p>
                    </div>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="كلمة المرور"
                            className="font-bold text-gray-700 mb-2 block"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full py-3 px-4 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
                            isFocused
                            placeholder="أدخل كلمة المرور للتأكيد"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                        <SecondaryButton onClick={closeModal} className="py-3 px-6 rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50">
                            إلغاء
                        </SecondaryButton>

                        <DangerButton disabled={processing} className="py-3 px-6 rounded-xl font-bold shadow-lg shadow-red-500/20">
                            تأكيد الحذف
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
