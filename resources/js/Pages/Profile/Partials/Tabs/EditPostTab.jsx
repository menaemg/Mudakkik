import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import { FaSave, FaImage, FaArrowRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function EditPostTab({ post, categories, setActiveTab }) {
    const [blobUrl, setBlobUrl] = useState(null);
    const getInitialImage = () => post.image || null;

    const [imagePreview, setImagePreview] = useState(getInitialImage());
    useEffect(() => {
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    const { data, setData, post: submitPost, processing, errors } = useForm({
        _method: 'PUT',
        title: post.title,
        body: post.body,
        category_id: post.category_id,
        image: null,
        type: post.type || 'article',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            const newBlobUrl = URL.createObjectURL(file);
            setBlobUrl(newBlobUrl);
            setImagePreview(newBlobUrl);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'هل تريد حفظ التعديلات؟',
            text: "سيتم تحويل حالة المقال إلى 'قيد المراجعة' تلقائياً.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احفظ',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                submitPost(route('posts.update', post.id), {
                    forceFormData: true,
                    onSuccess: () => {
                        Swal.fire('تم الحفظ!', 'تم تحديث المقال بنجاح.', 'success')
                            .then(() => setActiveTab('articles'));
                    }
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in duration-500">
             <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                        <FaSave className="text-green-600" /> تعديل المقال
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">تنبيه: التعديل يعيد المقال للمراجعة.</p>
                </div>
                <Button variant="ghost" onClick={() => setActiveTab('articles')} className="text-gray-500 hover:text-gray-900">
                    <FaArrowRight className="ml-2" /> إلغاء
                </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel value="عنوان المقال" />
                    <TextInput value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full" />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel value="القسم" />
                        <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue">
                            <option value="">اختر القسم</option>
                            {categories && categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="النوع" />
                        <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue">
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
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-sm text-gray-500">اضغط لرفع صورة جديدة</span>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                                />
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <span className="text-white font-bold border border-white px-4 py-2 rounded-lg">تغيير الصورة</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel value="المحتوى" />
                    <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue min-h-[300px]"></textarea>
                    <InputError message={errors.body} className="mt-2" />
                </div>

                <div className="flex justify-end">
                    <Button disabled={processing} className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 font-bold">
                        <FaSave className="ml-2" /> حفظ التعديلات
                    </Button>
                </div>
            </form>
        </div>
    );
}
