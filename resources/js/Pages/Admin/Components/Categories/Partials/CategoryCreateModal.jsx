import React from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Tag, AlignRight, CheckCircle, Save } from "lucide-react";

export default function CategoryCreateModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        slug: "",
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#001246]/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white/20 font-sans"
                    >
                        <div className="bg-[#001246] p-8 text-white flex justify-between items-center" dir="rtl">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#D00000] rounded-2xl shadow-lg shadow-red-900/40">
                                    <Layers size={24} />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-black">إضافة فئة جديدة</h3>
                                    <p className="text-white/60 text-xs font-bold mt-1">تنظيم المحتوى الإخباري للمنصة</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6" dir="rtl">
                            
                            <div className="space-y-6 text-right">
                                
                              
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <Tag size={16} className="text-[#D00000]" /> اسم الفئة
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="مثال: أخبار الرياضة، التكنولوجيا..."
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full p-4 bg-slate-50 border-2 ${errors.name ? 'border-red-200' : 'border-slate-100'} rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all`} 
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold pr-2">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <CheckCircle size={16} className="text-[#D00000]" /> الرابط المختصر (Slug)
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="مثل اخبار-السياسة ..."
                                        value={data.slug} 
                                        onChange={e => setData('slug', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold transition-all dir-ltr text-left" 
                                        dir="ltr"
                                    />
                                    <p className="text-slate-400 text-[10px] font-bold pr-1">ملاحظة: الرابط الذي يظهر في عنوان المتصفح (URL).</p>
                                    {errors.slug && <p className="text-red-500 text-xs font-bold pr-2">{errors.slug}</p>}
                                </div>

                             
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-[#001246] flex items-center gap-2">
                                        <AlignRight size={16} className="text-[#D00000]" /> وصف الفئة
                                    </label>
                                    <textarea 
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#D00000] outline-none font-bold h-32 resize-none"
                                        placeholder="اكتب وصفاً مختصراً لمحتوى هذه الفئة..."
                                    />
                                    {errors.description && <p className="text-red-500 text-xs font-bold pr-2">{errors.description}</p>}
                                </div>
                            </div>

                          
                            <div className="pt-4">
                                <button 
                                    disabled={processing}
                                    className="w-full py-5 bg-[#001246] text-white font-black text-lg rounded-[1.8rem] shadow-xl shadow-blue-900/20 hover:bg-[#D00000] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    <Save size={20} />
                                    {processing ? "جاري الحفظ..." : "حفظ بيانات الفئة"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}