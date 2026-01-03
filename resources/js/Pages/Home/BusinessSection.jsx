import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowLeft, FaBriefcase } from 'react-icons/fa';

const SectionLabel = ({ title }) => (
    <div className="mb-8 border-b border-gray-200 pb-3 flex justify-between items-end">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-black rounded-sm"></span>
            {title}
        </h2>
        <a href="#" className="text-xs font-bold text-gray-500 hover:text-brand-blue flex items-center gap-1 transition-colors group">
            عرض المزيد <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </a>
    </div>
);

const BusinessCard = ({ title, date, image, delay }) => (
    <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay={delay}>
        <div className="h-48 overflow-hidden relative">
            <img
                src={image}
                alt={title}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-gray-800">
                {date}
            </div>
        </div>
        <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-brand-blue font-bold mb-2 uppercase tracking-wide">
                <FaBriefcase size={10} />
                <span>مال وأعمال</span>
            </div>
            <h3 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-3">
                {title}
            </h3>
        </div>
    </div>
);

export default function BusinessSection() {
    return (
        <section className="container mx-auto px-4 py-16 border-b border-gray-100">
            <SectionLabel title="مال وأعمال" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BusinessCard delay="0" title="قطاع العقارات يستقر بعد أشهر من التقلبات المستمرة" date="25 يوليو" image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&fit=crop" />
                <BusinessCard delay="100" title="معدل البطالة ينخفض مع تعافي سوق العمل بشكل ملحوظ" date="25 يوليو" image="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&fit=crop" />
                <BusinessCard delay="200" title="الشركات الناشئة تواجه أزمة تمويل في سوق رأس المال" date="24 يوليو" image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&fit=crop" />
                <BusinessCard delay="300" title="عمالقة التكنولوجيا يعلنون عن اندماج استراتيجي لتعزيز النمو" date="23 يوليو" image="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&fit=crop" />
            </div>
        </section>
    );
}
