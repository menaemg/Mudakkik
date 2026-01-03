import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Badge } from "@/components/ui/badge";
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

const NewsCard = ({ news, delay }) => (
    <Link
        href={route('posts.show', news.slug)}
        className="group cursor-pointer flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 block"
        data-aos="fade-up"
        data-aos-delay={delay}
    >
        <div className="h-48 overflow-hidden relative">
            <img
                src={news.image?.startsWith('http') ? news.image : `/storage/${news.image}`}
                alt={news.title}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => e.target.src = '/assets/images/placeholder.webp'}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <Badge className={`absolute bottom-3 right-3 bg-brand-red text-white border-0 px-3 py-1 rounded-md shadow-md text-[10px]`}>
                {news.category?.name || 'عام'}
            </Badge>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-[15px] leading-snug text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-3 mb-4">
                {news.title}
            </h3>
            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                    <FaClock size={10} /> {new Date(news.created_at).toLocaleDateString('ar-EG')}
                </span>
                <span className="flex items-center gap-1 group-hover:text-brand-blue transition-colors">
                    اقرأ المزيد <FaArrowLeft size={10} />
                </span>
            </div>
        </div>
    </Link>
);

const SectionLabel = ({ title }) => (
    <div className="mb-8 border-b border-gray-200 pb-3 flex justify-between items-end">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-brand-red rounded-sm"></span>
            {title}
        </h2>
        <Link href={route('posts.index')} className="text-xs font-bold text-gray-500 hover:text-brand-blue flex items-center gap-1 transition-colors">
            عرض الكل <FaArrowLeft size={10} />
        </Link>
    </div>
);

export default function MoreNewsSection({ articles = [], ads }) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="container mx-auto px-4 py-8 mb-12">
            <SectionLabel title="المزيد من الأخبار" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                {articles.length > 0 ? (
                    articles.map((news, index) => (
                        <NewsCard key={news.id} news={news} delay={index * 50} />
                    ))
                ) : (
                    Array(8).fill(null).map((_, i) => (
                        <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))
                )}
            </div>
        </section>
    );
}
