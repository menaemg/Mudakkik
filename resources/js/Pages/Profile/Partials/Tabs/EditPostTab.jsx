import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import {
    FaSave,
    FaImage,
    FaArrowRight,
    FaEdit,
    FaLayerGroup,
    FaTag,
    FaHeading,
    FaCamera
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getImagePath } from '@/utils';

export default function EditPostTab({ post, categories, setActiveTab }) {
    const [blobUrl, setBlobUrl] = useState(null);
    const getInitialImage = () => {
        if (post.image) return getImagePath(post.image);
        return getImagePath(null);
    };

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

    const isDirty =
        data.title !== post.title ||
        data.body !== post.body ||
        String(data.category_id) !== String(post.category_id) ||
        data.type !== (post.type || 'article') ||
        data.image !== null;

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
        if (!isDirty) return;

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
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 animate-in fade-in duration-700 relative overflow-hidden min-h-[calc(100vh-16rem)] h-full flex flex-col">

            <div className="absolute top-0 left-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-10"></div>

            <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-black text-2xl text-[#020617] flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm border border-green-100">
                            <FaEdit size={18} />
                        </div>
                        تعديل المحتوى
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-lg w-fit border border-amber-100 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        تنبيه: الحفظ سيعيد المقال للمراجعة
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setActiveTab('articles')}
                    className="border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-5 h-10 gap-2 font-bold"
                >
                    <FaArrowRight size={12} /> إلغاء وتراجع
                </Button>
            </div>

            <form onSubmit={submit} className="space-y-8 flex-grow flex flex-col">

                <div className="space-y-2">
                    <InputLabel value="عنوان المقال" className="text-gray-700 font-bold" />
                    <div className="relative">
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-lg font-bold py-4 px-5 pl-12 rounded-2xl border-gray-200 bg-white focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:font-normal"
                        />
                        <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel value="القسم" className="text-gray-700 font-bold flex items-center gap-2"><FaLayerGroup className="text-gray-400" /> التصنيف</InputLabel>
                        <div className="relative">
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full appearance-none py-3.5 px-5 rounded-xl border-gray-200 bg-gray-50 text-gray-700 font-medium focus:border-green-500 focus:ring-green-500 shadow-sm cursor-pointer hover:bg-white transition-colors"
                            >
                                <option value="">اختر القسم</option>
                                {categories && categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <FaLayerGroup size={12} />
                            </div>
                        </div>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="النوع" className="text-gray-700 font-bold flex items-center gap-2"><FaTag className="text-gray-400" /> نوع المحتوى</InputLabel>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setData('type', 'article')}
                                className={`cursor-pointer rounded-xl border p-3 flex items-center justify-center gap-2 transition-all ${data.type === 'article' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="font-bold text-sm">مقال</span>
                            </div>
                            <div
                                onClick={() => setData('type', 'news')}
                                className={`cursor-pointer rounded-xl border p-3 flex items-center justify-center gap-2 transition-all ${data.type === 'news' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="font-bold text-sm">خبر</span>
                            </div>
                        </div>
                        <InputError message={errors.type} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-2">
                    <InputLabel value="صورة الغلاف" className="text-gray-700 font-bold" />
                    <div className="mt-2">
                        {!imagePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                                    <span className="text-sm text-gray-500 font-medium">اضغط لرفع صورة جديدة</span>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-gray-200 group shadow-md">
                              <img
                                  src={getImagePath(imagePreview)}
                                  alt="Preview"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/placeholder.jpg';
                                  }}
                              />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-3">
                                    <label className="cursor-pointer bg-white text-gray-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                                        <FaCamera className="text-green-600" />
                                        تغيير
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-2 flex-grow flex flex-col">
                    <InputLabel value="المحتوى" className="text-gray-700 font-bold" />
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="block w-full h-full rounded-2xl border-gray-200 bg-white shadow-sm focus:border-green-500 focus:ring-green-500 min-h-[400px] py-4 px-5 text-base leading-relaxed flex-grow"
                    ></textarea>
                    <InputError message={errors.body} className="mt-2" />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100 mt-auto">
                    <Button
                        disabled={processing || !isDirty}
                        className={`
                            px-10 py-4 rounded-xl shadow-lg font-bold text-sm transition-all transform
                            ${!isDirty
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {processing ? 'جاري الحفظ...' : (
                            <span className="flex items-center gap-2">
                                <FaSave /> حفظ التعديلات
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
