import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { FaLock, FaKey, FaCheckCircle } from 'react-icons/fa';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">تحديث كلمة المرور</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
                    تأكد من استخدام كلمة مرور قوية وطويلة للحفاظ على أمان حسابك. ينصح باستخدام مزيج من الحروف والأرقام والرموز.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel
                        htmlFor="current_password"
                        value="كلمة المرور الحالية"
                        className="text-gray-700 font-bold"
                    />
                    <div className="relative">
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full pl-10 py-3 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 transition-all bg-gray-50/50 focus:bg-white"
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="كلمة المرور الجديدة" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full pl-10 py-3 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 transition-all bg-white"
                                autoComplete="new-password"
                                placeholder="كلمة مرور قوية"
                            />
                            <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="تأكيد كلمة المرور"
                            className="text-gray-700 font-bold"
                        />
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full pl-10 py-3 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 transition-all bg-white"
                                autoComplete="new-password"
                                placeholder="أعد الكتابة للتأكيد"
                            />
                            <FaCheckCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <PrimaryButton disabled={processing} className="bg-[#000a2e] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                        تحديث الأمان
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-lg">
                            <FaCheckCircle /> تم التحديث بنجاح
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
