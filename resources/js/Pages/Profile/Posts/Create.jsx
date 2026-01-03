import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import { FaPaperPlane, FaImage } from 'react-icons/fa';

export default function Create({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        category_id: '',
        image: null,
        type: 'article',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('posts.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="كتابة مقال جديد" />

            <div className="py-12 bg-gray-50/50 min-h-screen font-sans text-right" dir="rtl">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 p-8">

                        <div className="mb-8 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-black text-gray-900">شاركنا قصتك</h2>
                            <p className="text-gray-500 mt-1">اكتب مقالاً جديداً وشاركه مع العالم.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">

                            <div>
                                <InputLabel htmlFor="title" value="عنوان المقال" className="text-lg font-bold" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-2 block w-full text-lg"
                                    placeholder="اكتب عنواناً جذاباً..."
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="category" value="القسم" className="font-bold" />
                                    <select
                                        id="category"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="mt-2 block w-full border-gray-300 focus:border-brand-blue focus:ring-brand-blue rounded-md shadow-sm h-11"
                                    >
                                        <option value="">اختر القسم المناسب</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="type" value="نوع المحتوى" className="font-bold" />
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="mt-2 block w-full border-gray-300 focus:border-brand-blue focus:ring-brand-blue rounded-md shadow-sm h-11"
                                    >
                                        <option value="article">مقال رأي / تقرير</option>
                                        <option value="news">خبر عاجل</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel value="صورة الغلاف" className="font-bold" />
                                <div className="mt-2 flex items-center justify-center w-full">
                                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">اضغط لرفع صورة</span></p>
                                            <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                                        </div>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setData('image', e.target.files[0])}
                                        />
                                    </label>
                                </div>
                                {data.image && <p className="text-sm text-green-600 mt-2 font-bold">تم اختيار: {data.image.name}</p>}
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="body" value="محتوى المقال" className="font-bold" />
                                <textarea
                                    id="body"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    className="mt-2 block w-full border-gray-300 focus:border-brand-blue focus:ring-brand-blue rounded-md shadow-sm min-h-[300px]"
                                    placeholder="اكتب تفاصيل مقالك هنا..."
                                ></textarea>
                                <InputError message={errors.body} className="mt-2" />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button className="bg-brand-red hover:bg-red-700 text-white font-bold h-12 px-8 text-lg shadow-lg flex items-center gap-2" disabled={processing}>
                                    <FaPaperPlane /> إرسال للنشر
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
