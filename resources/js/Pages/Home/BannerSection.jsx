import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBolt, FaStar, FaExternalLinkAlt } from 'react-icons/fa';

const BannerSkeleton = () => (
    <section className="container mx-auto px-4 py-8 md:py-12 mb-8">
        <div className="relative w-full h-[450px] rounded-2xl bg-gray-200 animate-pulse overflow-hidden border border-gray-100">

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3 lg:w-1/2 z-10">

                <div className="w-32 h-6 bg-gray-300 rounded-full mb-4"></div>

                <div className="w-3/4 h-10 bg-gray-300 rounded-lg mb-3"></div>
                <div className="w-1/2 h-10 bg-gray-300 rounded-lg mb-6"></div>

                <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-gray-300 rounded mb-8"></div>

                <div className="w-48 h-12 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    </section>
);

export default function BannerSection({ data, type = 'news' }) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);
    if (!data) return <BannerSkeleton />;

    const isAd = type === 'ad';

    const content = {
        image: data?.image
            ? (data.image.startsWith('http') ? data.image : `/storage/${data.image}`)
            : "/assets/images/banner-placeholder.webp",

        title: data?.title || (isAd ? data?.company_name : ''),

        description: data?.description || (isAd ? data?.notes : data?.excerpt),

        category: isAd ? "شريك استراتيجي" : (data?.category?.name || "تغطية حصرية"),

        link: isAd ? data?.link : route('posts.show', data?.slug || '#')
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-12 mb-8" data-aos="fade-up">
            <div className={`relative w-full h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl
                ${isAd ? 'border-2 border-amber-400/50' : 'border border-gray-100'}
            `}>
                <img
                    src={content.image}
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 will-change-transform"
                />

                <div className={`absolute inset-0 bg-gradient-to-l opacity-90
                    ${isAd ? 'from-slate-900 via-slate-900/70 to-amber-900/20' : 'from-black/95 via-black/60 to-transparent'}
                `}></div>

                {isAd && (
                    <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded text-xs font-bold">
                        إعلان ممول
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3 lg:w-1/2 z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1
                            ${isAd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-brand-red animate-pulse'}
                        `}>
                            {isAd ? <FaStar /> : <FaBolt />}
                            {content.category}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 drop-shadow-xl group-hover:text-gray-100 transition-colors">
                        {content.title}
                    </h2>

                    <p className="text-gray-200 text-sm md:text-base mb-8 line-clamp-2 leading-relaxed opacity-90 max-w-lg">
                        {content.description}
                    </p>

                    <div className="flex gap-4">
                        <a href={content.link} target={isAd ? "_blank" : "_self"}>
                            <Button className={`rounded-full px-8 py-6 text-base font-bold shadow-lg hover:-translate-y-1 transition-all
                                ${isAd ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-900/20' : 'bg-brand-red hover:bg-red-700 text-white shadow-red-900/50'}
                            `}>
                                {isAd ? (
                                    <span className="flex items-center gap-2">زيارة الموقع <FaExternalLinkAlt size={12} /></span>
                                ) : "استكشف التغطية الكاملة"}
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
