import React from "react";
import { 
    ArrowRight, Calendar, User, Tag, 
    Heart, CheckCircle, ShieldCheck, Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";

export default function PostView({ post, onBack }) {
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "https://images.unsplash.com/photo-1504711432869-efd5973bd14f?q=80&w=1000&auto=format&fit=crop";
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden font-sans relative" dir="rtl">
  
            <div className="p-6 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#001246] font-black hover:bg-slate-100 px-6 py-2 rounded-2xl transition-all border border-slate-100"
                >
                    <ArrowRight size={20} /> رجوع للجدول
                </button>
                
                <div className="flex gap-4">
                   
                     <div className="flex items-center gap-2 bg-pink-50 text-pink-600 px-5 py-2 rounded-2xl font-black border border-pink-100">
                        <Heart size={20} fill="currentColor" />
                        <span>{post.likes_count || 0} إعجاب</span>
                    </div>
                    <div className="hidden md:flex bg-[#001246]/5 text-[#001246] px-5 py-2 rounded-2xl text-xs font-black items-center gap-2">
                        <ShieldCheck size={16} className="text-[#D00000]" /> لوحة التحكم
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 max-w-6xl mx-auto text-right">

                <div className="mb-10">
                    <div className="flex gap-3 mb-6 justify-start">
                        <span className="bg-[#D00000] text-white px-5 py-1.5 rounded-full text-xs font-black shadow-sm shadow-red-200">
                            {post.category?.name || "بدون قسم"}
                        </span>
                        <span className={`px-5 py-1.5 rounded-full text-xs font-black border ${
                            post.status === 'published' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                            {post.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                    </div>
                    <h1 className="text-[#001246] text-3xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                        {post.title}
                    </h1>
                </div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative h-[400px] md:h-[600px] w-full rounded-[4rem] overflow-hidden mb-12 shadow-2xl ring-8 ring-slate-50"
                >
                    <img 
                        src={post.image?.startsWith('http') ? post.image : `/storage/${post.image}`} 
                        className="w-full h-full object-cover shadow-inner" 
                        alt={post.title}
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 p-2">
                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-14 h-14 bg-[#001246] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#D00000] transition-colors">
                            <User size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">الكاتب المسؤول</p>
                            <p className="text-[#001246] font-black text-lg">{post.user?.name || "الأدمن"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-14 h-14 bg-[#001246] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#D00000] transition-colors">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">تاريخ النشر</p>
                            <p className="text-[#001246] font-black text-lg">
                                {new Date(post.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-14 h-14 bg-[#001246] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#D00000] transition-colors">
                            <CheckCircle size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">تقييم المصداقية</p>
                            <p className="text-[#001246] font-black text-lg">
                                {post.ai_verdict === 'trusted' ? 'خبر موثوق' : post.ai_verdict === 'fake' ? 'خبر زائف' : 'غير مراجع'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="text-slate-700 text-xl md:text-2xl leading-[2.5] font-medium mb-20 text-right whitespace-pre-wrap border-r-4 border-slate-100 pr-8">
                        {post.body}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-12 border-t border-slate-100 items-center">
                            <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl ml-2">
                                <Tag size={22} />
                            </div>
                            {post.tags.map(tag => (
                                <span 
                                    key={tag.id} 
                                    className="bg-slate-50 border border-slate-200 text-slate-500 px-6 py-2.5 rounded-2xl text-sm font-black hover:border-[#D00000] hover:text-[#D00000] transition-all duration-300 cursor-default"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}