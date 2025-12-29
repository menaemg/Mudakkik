import React from "react";
import { useForm } from "@inertiajs/react";
import { ArrowRight, Save, Image as ImageIcon, Type, Layout, Hash } from "lucide-react";

export default function PostEdit({ post, categories, tags, onBack }) {
    const { data, setData, post: submit, processing, errors } = useForm({
        _method: 'patch',
        title: post.title || '',
        body: post.body || '',
        category_id: post.category_id || '',
        tag_ids: post.tags?.map(t => t.id) || [],
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(route("admin.posts.update", post.id), {
            onSuccess: () => onBack(),
        });
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 
        overflow-hidden font-sans">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <button onClick={onBack} className="flex items-center gap-2 text-[#001246] font-black
                 hover:bg-slate-200 px-6 py-2 rounded-2xl transition-all border border-slate-200">
                    <ArrowRight size={20} /> إلغاء والتراجع
                </button>
                <div className="flex items-center gap-2 text-slate-400 font-bold">
                    تعديل المقال: <span className="text-[#001246]">{post.title}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 max-w-5xl mx-auto space-y-10">
            
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[#001246] font-black text-xl">
                        <Type className="text-[#D00000]" /> عنوان المقال
                    </label>
                    <input 
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] 
                        focus:border-[#D00000] focus:bg-white outline-none font-black text-2xl 
                        transition-all"
                        placeholder="اكتب العنوان هنا..."
                    />
                    {errors.title && <p className="text-red-500 text-sm font-bold">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[#001246] font-black text-lg">
                            <Layout className="text-[#D00000]" /> التصنيف
                        </label>
                        <select 
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl
                             font-bold outline-none focus:border-[#D00000]"
                        >
                            <option value="">اختر القسم</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[#001246] font-black text-lg">
                            <ImageIcon className="text-[#D00000]" /> تغيير الصورة (اختياري)
                        </label>
                        <input 
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[#001246] font-black text-xl">
                        المحتوى التفصيلي
                    </label>
                    <textarea 
                        rows="15"
                        value={data.body}
                        onChange={e => setData('body', e.target.value)}
                        className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[3rem] focus:border-[#D00000] focus:bg-white outline-none font-medium text-xl leading-[2] transition-all"
                        placeholder="ابدأ بكتابة تفاصيل الخبر هنا..."
                    />
                    {errors.body && <p className="text-red-500 text-sm font-bold">{errors.body}</p>}
                </div>

             
                <div className="pt-10 border-t border-slate-100">
                    <button 
                        disabled={processing}
                        className="w-full md:w-auto px-12 py-5 bg-[#001246] text-white rounded-[2rem] font-black text-xl hover:bg-[#D00000] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                    >
                        <Save size={24} />
                        {processing ? "جاري الحفظ..." : "تحديث المقال الآن"}
                    </button>
                </div>
            </form>
        </div>
    );
}