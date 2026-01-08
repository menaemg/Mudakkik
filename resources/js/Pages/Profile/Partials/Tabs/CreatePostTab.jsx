import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import {
    FaPaperPlane,
    FaImage,
    FaTimes,
    FaLayerGroup,
    FaTag,
    FaQuestion,
    FaHeading,
    FaExclamationTriangle
} from 'react-icons/fa';

export default function CreatePostTab({ categories, setActiveTab }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        title: '',
        body: '',
        category_id: '',
        image: null,
        type: 'article',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
            if (errors.image) clearErrors('image');
        }
    };

    const handleInitialCheck = (e) => {
        e.preventDefault();
        clearErrors();

        let hasError = false;
        let firstErrorField = null;

        if (!data.title || data.title.trim() === '') {
            setError('title', 'عنوان المقال مطلوب');
            hasError = true;
            if (!firstErrorField) firstErrorField = 'title';
        }
        if (!data.category_id) {
            setError('category_id', 'يرجى اختيار القسم');
            hasError = true;
            if (!firstErrorField) firstErrorField = 'category';
        }
        if (!data.image) {
            setError('image', 'صورة الغلاف مطلوبة');
            hasError = true;
            if (!firstErrorField) firstErrorField = 'image-container';
        }
        if (!data.body || data.body.trim().length < 50) {
            setError('body', 'محتوى المقال يجب أن يكون 50 حرفاً على الأقل');
            hasError = true;
            if (!firstErrorField) firstErrorField = 'body';
        }

        if (hasError) {
            if (firstErrorField) {
                const element = document.getElementById(firstErrorField);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setShowConfirmModal(true);
    };

    const submitToBackend = () => {
        post(route('posts.store'), {
            forceFormData: true,
            onSuccess: () => {
                setShowConfirmModal(false);
                if (setActiveTab) setActiveTab('articles');
                else window.location.reload();
            },
            onError: () => setShowConfirmModal(false)
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden flex flex-col min-h-[calc(100vh-16rem)] h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>

            {Object.keys(errors).length > 0 && (
                <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                    <FaExclamationTriangle className="text-red-500 shrink-0" />
                    <span className="text-red-800 font-bold text-sm">يرجى استكمال البيانات الناقصة أدناه.</span>
                </div>
            )}

            <form onSubmit={handleInitialCheck} className="space-y-8 flex-grow flex flex-col">

                <div className="space-y-2" id="title">
                    <InputLabel value="عنوان المقال" className="text-gray-700 font-bold text-base" />
                    <div className="relative">
                        <TextInput
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full text-lg font-bold py-4 px-5 pl-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-brand-blue/20 transition-all placeholder:font-normal ${errors.title ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="اكتب عنواناً يخطف الأنظار..."
                        />
                        <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2" id="category">
                        <InputLabel value="القسم" className="text-gray-700 font-bold flex items-center gap-2"><FaLayerGroup className="text-gray-400" /> التصنيف</InputLabel>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className={`w-full py-3.5 px-5 rounded-xl border-gray-200 bg-white text-gray-700 font-medium focus:border-brand-blue focus:ring-brand-blue shadow-sm cursor-pointer hover:border-gray-300 transition-colors ${errors.category_id ? 'border-red-500' : ''}`}
                        >
                            <option value="">اختر القسم المناسب</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="النوع" className="text-gray-700 font-bold flex items-center gap-2"><FaTag className="text-gray-400" /> نوع المحتوى</InputLabel>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setData('type', 'article')}
                                className={`cursor-pointer rounded-xl border p-3 flex items-center justify-center gap-2 transition-all ${data.type === 'article' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="font-bold text-sm">مقال رأي</span>
                            </div>
                            <div
                                onClick={() => setData('type', 'news')}
                                className={`cursor-pointer rounded-xl border p-3 flex items-center justify-center gap-2 transition-all ${data.type === 'news' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="font-bold text-sm">خبر صحفي</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2" id="image-container">
                    <InputLabel value="صورة الغلاف" className="text-gray-700 font-bold" />
                    <div className="mt-2">
                        {!imagePreview ? (
                            <label className={`flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 hover:border-brand-blue/30 transition-all duration-300 relative overflow-hidden ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaImage className={`w-6 h-6 transition-colors ${errors.image ? 'text-red-500' : 'text-gray-400 group-hover:text-brand-blue'}`} />
                                    <p className="mb-1 text-sm font-bold text-gray-600">اضغط لرفع صورة عالية الجودة</p>
                                    <p className="text-xs text-gray-400">PNG, JPG حتى 5MB</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                                    <label className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg cursor-pointer">
                                        تغيير الصورة
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (imagePreview) URL.revokeObjectURL(imagePreview);
                                            setImagePreview(null);
                                            setData('image', null);
                                        }}
                                        className="bg-red-500/80 hover:bg-red-600 text-white p-2.5 rounded-lg"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </div>

                <div className="space-y-2 flex-grow flex flex-col" id="body">
                    <InputLabel value="المحتوى" className="text-gray-700 font-bold" />
                    <div className="relative flex-grow h-full">
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className={`block w-full h-full rounded-2xl border-gray-200 bg-white shadow-sm focus:border-brand-blue focus:ring-brand-blue min-h-[400px] py-4 px-5 text-base leading-relaxed resize-y placeholder:text-gray-400 ${errors.body ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="ابدأ في كتابة قصتك هنا..."
                        ></textarea>
                        <div className="absolute bottom-4 left-4 text-xs text-gray-400 font-medium bg-white/80 px-2 py-1 rounded-md">
                            {data.body.length} حرف
                        </div>
                    </div>
                    <InputError message={errors.body} className="mt-2" />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100 mt-auto">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gradient-to-r from-brand-red to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl shadow-lg shadow-red-500/30 font-bold text-sm transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <FaPaperPlane className="text-white/90" />
                            {processing ? 'جاري النشر...' : 'نشر المقال'}
                        </span>
                    </Button>
                </div>
            </form>

            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000a2e]/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 text-center relative overflow-hidden border border-white/20">

                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-brand-red via-purple-500 to-brand-blue"></div>

                        <div className="w-24 h-24 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
                            <FaQuestion size={40} className="animate-bounce" />
                        </div>

                        <h3 className="text-3xl font-black text-[#000a2e] mb-4">هل أنت جاهز للنشر؟</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium">
                            سيتم إرسال المقال إلى فريق التحرير للمراجعة قبل نشره للعامة. هل تود تأكيد العملية؟
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-8 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-lg"
                            >
                                تراجع
                            </button>
                            <button
                                onClick={submitToBackend}
                                disabled={processing}
                                className="px-10 py-4 rounded-xl font-bold text-white bg-[#000a2e] hover:bg-brand-red shadow-xl flex items-center gap-3 text-lg"
                            >
                                {processing ? 'جاري الإرسال...' : 'نعم، انشر المقال'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
