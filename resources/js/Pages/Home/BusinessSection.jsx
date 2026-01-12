import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowLeft,
  FaBriefcase,
  FaChartLine,
  FaCoins
} from 'react-icons/fa';
import { Link } from '@inertiajs/react';

const SectionLabel = ({ title }) => (
    <div className="mb-6 md:mb-8 border-b border-gray-200 pb-3 flex justify-between items-end">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-2 h-6 sm:h-8 bg-black rounded-sm"></span>
            {title}
        </h2>
        <Link href={route('posts.index', { category: 'economy' })} className="text-xs font-bold
        text-gray-500 hover:text-brand-blue flex items-center gap-1
        transition-colors group">
            عرض المزيد <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </Link>
    </div>
);

const BusinessCard = ({ title, date, image, delay, slug, categoryName }) => (
    <Link href={route('posts.show', slug || '#')} className="group
    cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm
    hover:shadow-xl hover:-translate-y-1 transition-all
    duration-300 border border-gray-100 block" data-aos="fade-up" data-aos-delay={delay}>
        <div className="h-48 overflow-hidden relative">
            <img
                src={image?.startsWith('http') ? image : `/storage/${image}`}
                alt={title}
                crossOrigin="anonymous" referrerPolicy="no-referrer"
                className="w-full h-full object-cover
                transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    if (e.target.src !== '/assets/images/post.webp') {
                        e.target.src = '/assets/images/post.webp';
                    }
                }}
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
            text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-gray-800">
                {new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
            </div>
        </div>
        <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-brand-blue
            font-bold mb-2 uppercase tracking-wide">
                <FaBriefcase size={10} />
                <span>{categoryName || 'اقتصاد وأعمال'}</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg leading-snug
            text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-3">
                {title}
            </h3>
        </div>
    </Link>
);

export default function BusinessSection({ articles = [], ads }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const displayArticles = articles.length > 0 ? articles.slice(0, 4) : [];

    return (
        <section className="w-full bg-gradient-to-b from-white to-slate-50/50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionLabel title="مال وأعمال" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayArticles.map((article, index) => (
                        <BusinessCard
                            key={article.id}
                            delay={index * 100}
                            title={article.title}
                            date={article.created_at}
                            image={article.image}
                            slug={article.slug}
                            categoryName={article.category?.name}
                        />
                    ))}

                    {displayArticles.length === 0 && Array(4).fill(null).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
