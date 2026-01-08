import React from 'react';
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaCalendarAlt, FaClock, FaGlobe, FaBullhorn, FaImage } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";

const getImagePath = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function ViewAdTab({ ad, setActiveTab }) {
    if (!ad) return null;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h3 className="font-black text-2xl text-[#020617] flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                            <FaBullhorn size={18} />
                        </div>
                        تفاصيل الحملة
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                         <Badge variant="outline" className="text-gray-500 border-gray-200">ID: #{ad.id}</Badge>
                         <Badge className={ad.status === 'approved' ? "bg-emerald-500" : "bg-gray-500"}>{ad.status}</Badge>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setActiveTab('ads')}
                    className="border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-5 h-10 gap-2 font-bold"
                >
                    <FaArrowRight size={12} /> عودة للقائمة
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FaImage className="text-gray-400" /> صورة الإعلان
                    </label>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 h-[300px] relative group">
                        <img
                            src={getImagePath(ad.image_path)}
                            alt={ad.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="space-y-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 h-full">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">عنوان الحملة</label>
                        <p className="text-xl font-black text-gray-900">{ad.title}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">الرابط المستهدف</label>
                        <a href={ad.target_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-blue hover:underline font-bold dir-ltr w-fit">
                            <FaGlobe /> {ad.target_url}
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><FaCalendarAlt /> تاريخ البدء</label>
                            <p className="font-mono font-bold text-gray-700">{new Date(ad.requested_start_date).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><FaClock /> المدة</label>
                            <p className="font-mono font-bold text-gray-700">{ad.duration} يوم</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
