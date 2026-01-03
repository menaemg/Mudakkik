import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { FaCamera } from 'react-icons/fa';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
        });

    const submit = (e) => {
            e.preventDefault();

        router.post(route('profile.update'), {
            _method: 'patch',
            ...data,
        }, {
            preserveScroll: true,
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
            <header>
                <h2 className="text-lg font-medium text-gray-900">معلومات الملف الشخصي</h2>
                <p className="mt-1 text-sm text-gray-600">قم بتحديث معلومات حسابك وصورة البروفايل.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                <div className="flex items-center gap-4">
                    <div className="relative group w-20 h-20">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                             {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-400">
                                {user.name?.charAt(0) || '?'}
                                </div>
                             )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-brand-blue text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors">
                            <FaCamera size={12} />
                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </label>
                    </div>
                    <div className="text-sm text-gray-500">
                        <p className="font-bold text-gray-700">صورة العرض</p>
                        <p className="text-xs">اضغط على الكاميرا للتغيير</p>
                    </div>
                </div>
                <InputError className="mt-2" message={errors.avatar} />


                <div>
                    <InputLabel htmlFor="name" value="الاسم" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            عنوان بريدك الإلكتروني غير مؤكد.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2"
                            >
                                انقر هنا لإعادة إرسال رسالة التحقق.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                تم إرسال رابط تحقق جديد إلى عنوان بريدك الإلكتروني.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>حفظ التغييرات</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            تم الحفظ.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
