import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Badge } from "@/components/ui/badge";
import { FaClock, FaArrowLeft } from 'react-icons/fa';

const newsData = [
    { category: "سفر", title: "خطوط الرحلات البحرية تطلق مسارات جديدة لموسم العطلات", image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&fit=crop", color: "bg-teal-600" },
    { category: "عالم", title: "الأمم المتحدة تدين الأعمال العسكرية في مناطق النزاع", image: "https://images.unsplash.com/photo-1518558997970-4ddc236affcd?w=500&fit=crop", color: "bg-brand-red" },
    { category: "صحة", title: "دراسة جديدة تربط بين تناول السكر وأمراض القلب", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&fit=crop", color: "bg-green-600" },
    { category: "تكنولوجيا", title: "صانع الهواتف الذكية يكشف عن جهاز قابل للطي بميزات متقدمة", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&fit=crop", color: "bg-blue-600" },
    { category: "ترفيه", title: "ثنائي المشاهير يعلنون عن خطوبة مفاجئة على وسائل التواصل", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=500&fit=crop", color: "bg-pink-600" },
    { category: "أعمال", title: "تقييمات الشركات الناشئة تنخفض مع تشديد تمويل رأس المال", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&fit=crop", color: "bg-indigo-700" },
    { category: "عالم", title: "تصاعد التوترات بين الدول المجاورة حول النزاع الحدودي", image: "https://images.unsplash.com/photo-1589262740468-4ee1fe68a8e8?w=500&fit=crop", color: "bg-brand-red" },
    { category: "بيئة", title: "تغير المناخ يهدد المدن الساحلية مع ارتفاع منسوب البحار", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&fit=crop", color: "bg-green-700" }
];

const NewsCard = ({ news, delay }) => (
    <div className="group cursor-pointer flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay={delay}>
        <div className="h-48 overflow-hidden relative">
            <img
                src={news.image}
                alt={news.title}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <Badge className={`absolute bottom-3 right-3 ${news.color} text-white border-0 px-3 py-1 rounded-md shadow-md text-[10px]`}>
                {news.category}
            </Badge>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-[15px] leading-snug text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-3 mb-4">
                {news.title}
            </h3>
            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1"><FaClock size={10} /> 25 يوليو</span>
                <span className="flex items-center gap-1 group-hover:text-brand-blue transition-colors">
                    اقرأ المزيد <FaArrowLeft size={10} />
                </span>
            </div>
        </div>
    </div>
);

const SectionLabel = ({ title }) => (
    <div className="mb-8 border-b border-gray-200 pb-3 flex justify-between items-end">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-brand-red rounded-sm"></span>
            {title}
        </h2>
        <a href="#" className="text-xs font-bold text-gray-500 hover:text-brand-blue flex items-center gap-1 transition-colors">
            عرض الكل <FaArrowLeft size={10} />
        </a>
    </div>
);

export default function MoreNewsSection() {
    return (
        <section className="container mx-auto px-4 py-8 mb-12">
            <SectionLabel title="المزيد من الأخبار" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                {newsData.map((news, index) => (
                    <NewsCard key={index} news={news} delay={index * 50} />
                ))}
            </div>
        </section>
    );
}
