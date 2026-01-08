import React from 'react';
import { Button } from "@/components/ui/button";
import {
    FaArrowRight,
    FaCalendarAlt,
    FaClock,
    FaGlobe,
    FaBullhorn,
    FaImage,
    FaExternalLinkAlt,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaCalendarCheck
} from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";

const getImagePath = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

export default function ViewAdTab({ ad, setActiveTab }) {
    if (!ad) return null;

    const startDate = new Date(ad.requested_start_date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(ad.duration));

    const getStatusStyle = (status) => {
        switch(status) {
            case 'approved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <FaCheckCircle />, label: 'نشط / موافق عليه' };
            case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <FaHourglassHalf />, label: 'قيد المراجعة' };
            case 'rejected': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <FaTimesCircle />, label: 'مرفوض' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <FaClock />, label: status };
        }
    };

    const statusObj = getStatusStyle(ad.status);

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-8 md:p-10 relative overflow-hidden min-h-[calc(100vh-16rem)] flex flex-col h-full animate-in fade-in duration-700 slide-in-from-bottom-4">

            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-10"></div>

            <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h3 className="font-black text-2xl text-[#020617] flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                            <FaBullhorn size={18} />
                        </div>
                        تفاصيل الحملة
                    </h3>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-gray-400 border-gray-200 font-mono text-[10px]">#{ad.id}</Badge>
                        <span className="text-sm text-gray-500 font-medium">تم الإنشاء: {new Date(ad.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setActiveTab('ads')}
                    className="border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-5 h-10 gap-2 font-bold transition-all"
                >
                    <FaArrowRight size={12} /> عودة للقائمة
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-y-auto custom-scrollbar p-1">

                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <FaImage className="text-blue-500" /> معاينة الإعلان
                        </label>
                    </div>

                    <div className="rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-md bg-gray-900 h-[350px] relative group">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
                            style={{ backgroundImage: `url(${getImagePath(ad.image_path)})` }}
                        ></div>

                        <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                            <img
                                src={getImagePath(ad.image_path)}
                                alt={ad.title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">عنوان الحملة</label>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight">{ad.title}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 w-fit h-fit shrink-0 ${statusObj.bg} ${statusObj.text} ${statusObj.border}`}>
                                {statusObj.icon}
                                <span className="font-bold text-sm">{statusObj.label}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">الرابط المستهدف</label>
                             <a
                                href={ad.target_url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-3 p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl transition-colors w-full"
                            >
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <FaGlobe />
                                </div>
                                <span className="text-blue-700 font-bold truncate dir-ltr flex-1 text-left">{ad.target_url}</span>
                                <FaExternalLinkAlt className="text-blue-300 group-hover:text-blue-500" size={12} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 transition-colors group">
                            <div className="w-8 h-8 bg-white text-gray-500 rounded-lg flex items-center justify-center shadow-sm mb-3 group-hover:text-blue-500">
                                <FaCalendarAlt />
                            </div>
                            <label className="text-xs font-bold text-gray-400 block mb-1">تاريخ البدء</label>
                            <p className="font-black text-gray-800 text-lg font-mono">
                                {startDate.toLocaleDateString('ar-EG')}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 transition-colors group">
                            <div className="w-8 h-8 bg-white text-gray-500 rounded-lg flex items-center justify-center shadow-sm mb-3 group-hover:text-blue-500">
                                <FaCalendarCheck />
                            </div>
                            <label className="text-xs font-bold text-gray-400 block mb-1">تاريخ الانتهاء المتوقع</label>
                            <p className="font-black text-gray-800 text-lg font-mono">
                                {endDate.toLocaleDateString('ar-EG')}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 transition-colors group">
                            <div className="w-8 h-8 bg-white text-gray-500 rounded-lg flex items-center justify-center shadow-sm mb-3 group-hover:text-blue-500">
                                <FaClock />
                            </div>
                            <label className="text-xs font-bold text-gray-400 block mb-1">مدة الحملة</label>
                            <p className="font-black text-gray-800 text-lg">
                                {ad.duration} <span className="text-xs font-bold text-gray-500">أيام</span>
                            </p>
                        </div>
                    </div>

                    {ad.admin_notes && (
                        <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                             <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <FaBullhorn /> ملاحظات الإدارة
                             </h4>
                             <p className="text-amber-700 text-sm leading-relaxed">
                                {ad.admin_notes}
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
