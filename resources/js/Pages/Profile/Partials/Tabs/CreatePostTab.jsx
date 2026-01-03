import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function CreatePostTab({ categories, setActiveTab }) {
     const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        category_id: '',
        image: null,
        type: 'article',
    });

         useEffect(() => {
         return () => {
             if (imagePreview) {
                 URL.revokeObjectURL(imagePreview);
             }
         };
     }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
                if (imagePreview) {
                 URL.revokeObjectURL(imagePreview);
             }
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'هل أنت جاهز للنشر؟',
            text: "سيتم إرسال المقال للمراجعة قبل نشره للعامة.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000a2e',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، انشر المقال',
            cancelButtonText: 'تراجع'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('posts.store'), {
                    onSuccess: () => {
                        Swal.fire(
                            'تم الإرسال!',
                            'مقالك قيد المراجعة الآن.',
                            'success'
                        ).then(() => {
                             if (setActiveTab) setActiveTab('articles');
                             else window.location.reload();
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in duration-500">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                    <FaPaperPlane className="text-brand-red" /> كتابة مقال جديد
                </h3>
                <p className="text-gray-500 text-sm mt-1">شارك أفكارك مع العالم بأسلوبك الخاص.</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel value="عنوان المقال" />
                    <TextInput
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="عنوان جذاب..."
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel value="القسم" />
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                        >
                            <option value="">اختر القسم</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="النوع" />
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                        >
                            <option value="article">مقال</option>
                            <option value="news">خبر</option>
                        </select>
                        <InputError message={errors.type} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel value="صورة الغلاف" />
                    <div className="mt-2">
                        {!imagePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">اضغط لرفع صورة</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (imagePreview) URL.revokeObjectURL(imagePreview);
                                        setImagePreview(null);
                                        setData('image', null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel value="المحتوى" />
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue min-h-[300px]"
                        placeholder="اكتب هنا..."
                    ></textarea>
                    <InputError message={errors.body} className="mt-2" />
                </div>

                <div className="flex justify-end">
                    <Button disabled={processing} className="bg-brand-red text-white px-8 py-3 rounded-lg shadow-lg hover:bg-red-700 font-bold">
                        نشر المقال
                    </Button>
                </div>
            </form>
        </div>
    );
}
