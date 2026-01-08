import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBolt, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { getImagePath } from '@/utils/imagePaths';
import AdRotator from '@/Components/AdRotator';
import { motion } from 'framer-motion';

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

export default function BannerSection({ data, type = 'news', post, ad }) {

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const actualData = data || ad || post;
    const actualType = (!data && ad && ad.length > 0) ? 'ad' : type;

    if (!actualData) return <BannerSkeleton />;

    const isAd = actualType === 'ad';

    if (isAd && actualData) {
        const adsArray = Array.isArray(actualData) ? actualData : [actualData];

        return (
            <section className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50" data-aos="fade-up">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-red-500/10 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-200/50">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                                    <FaStar size={12} />
                                </motion.div>
                                عروض حصرية مختارة بعناية
                            </span>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <motion.div
                            className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-transparent rounded-full blur-3xl"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-300/20 to-transparent rounded-full blur-3xl"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative bg-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 hover:border-white/80 transition-all duration-500 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-transparent to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gradient-to-r from-amber-500 via-red-500 to-amber-500 to-transparent opacity-60"></div>

                            <div className="relative">
                                <AdRotator
                                    ads={adsArray}
                                    variant="banner"
                                    interval={5000}
                                    className="w-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    const content = {
        image: getImagePath(actualData?.image, "/assets/images/banner-placeholder.webp"),

        title: actualData?.title || (isAd ? actualData?.company_name : ''),

        description: actualData?.description || (isAd ? actualData?.notes : actualData?.excerpt),

        category: isAd ? "شريك استراتيجي" : (actualData?.category?.name || "تغطية حصرية"),

        link: isAd ? actualData?.link : (actualData?.slug ? route('posts.show', actualData.slug) : '#')
    };

    return (
        <section className="container mx-auto px-4 py-8 md:py-12 mb-8" data-aos="fade-up">
            <div className={`relative w-full h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl
                ${isAd ? 'border-2 border-amber-400/50' : 'border border-gray-100'}
            `}>
                <img
                    src={content.image}
                    alt={content.title || content.description || (isAd ? 'إعلان' : 'Banner')}
                    className="w-full h-full object-cover transition-transform duration-&lsqb;2000ms&rsqb; group-hover:scale-110 will-change-transform"
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
                        <a href={content.link} target={isAd ? "_blank" : "_self"} rel={isAd ? "noopener noreferrer" : undefined}>
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
