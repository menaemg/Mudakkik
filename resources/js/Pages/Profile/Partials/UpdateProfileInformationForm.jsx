import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { FaCamera, FaUser, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
        });

    useEffect(() => {
        if (user.avatar) {
            setAvatarPreview(`/storage/${user.avatar}`);
        } else {
            setAvatarPreview(null);
        }
    }, [user.avatar]);

    const submit = (e) => {
            e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const currentTab = urlParams.get('tab') || 'overview';

        router.post(route('profile.update'), {
            _method: 'patch',
            tab: currentTab,
            ...data,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(window.location.href, {
                    preserveScroll: true,
                    preserveState: false
                });
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setData('avatar', file);
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

      useEffect(() => {
          return () => {
              if (avatarPreview && avatarPreview.startsWith('blob:')) {
                  URL.revokeObjectURL(avatarPreview);
              }
          };
      }, [avatarPreview])

return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">معلومات الحساب الأساسية</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
                    قم بتحديث اسم العرض وعنوان البريد الإلكتروني وصورة الملف الشخصي لتخصيص تجربتك.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8">

                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="relative group w-24 h-24 shrink-0">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg bg-white relative">
                             {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                             ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-3xl text-gray-400">
                                {user.name?.charAt(0) || '?'}
                                </div>
                             )}
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-[#000a2e] text-white p-2.5 rounded-xl cursor-pointer hover:bg-brand-red shadow-xl shadow-gray-400/50 transition-all hover:scale-110 active:scale-95 border-4 border-white">
                            <FaCamera size={14} />
                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </label>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg mb-1">صورة العرض</p>
                        <p className="text-xs text-gray-500 font-medium">ينصح باستخدام صورة مربعة (PNG, JPG) بحجم لا يتعدى 2MB.</p>
                        <label className="text-brand-blue text-xs font-bold cursor-pointer hover:underline mt-2 inline-block">
                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            تغيير الصورة
                        </label>
                    </div>
                </div>
                <InputError className="mt-2" message={errors.avatar} />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="name" value="الاسم الكامل" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <TextInput
                                id="name"
                                className="mt-1 block w-full pl-10 py-3 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 transition-all bg-white font-medium"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                                placeholder="الاسم كما يظهر للآخرين"
                            />
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        </div>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="email" value="البريد الإلكتروني" className="text-gray-700 font-bold" />
                        <div className="relative">
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full pl-10 py-3 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20 transition-all bg-white font-medium"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="example@domain.com"
                                dir="ltr"
                            />
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        </div>
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-sm text-amber-800 font-bold mb-2">
                            ⚠️ عنوان بريدك الإلكتروني غير مؤكد.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-sm text-brand-blue underline hover:text-blue-800 font-bold transition-colors"
                        >
                            انقر هنا لإعادة إرسال رسالة التحقق.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg border border-green-100 inline-block">
                                ✅ تم إرسال رابط تحقق جديد إلى بريدك الإلكتروني.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <PrimaryButton disabled={processing} className="bg-[#000a2e] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                        حفظ التغييرات
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
                            <FaCheckCircle /> تم الحفظ بنجاح
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
