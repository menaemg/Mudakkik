import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const getImagePath = (path) => {
    if (!path) return '/assets/images/placeholder.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const getDomain = (url) => {
    try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '');
    } catch (e) {
        return 'Visit Site';
    }
};

export default function AdRotator({
    ads = [],
    interval = 6000,
    className = "",
    heightClass = "h-44",
}) {
    if (!ads || ads.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (ads.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, interval);
        return () => clearInterval(timer);
    }, [ads.length, interval]);

    const ad = ads[currentIndex];

    return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-[1.5rem] bg-[#fdfdfd] border border-slate-200 shadow-sm group ${className}`}>
            <AnimatePresence mode='wait'>
                <motion.a
                    key={ad.id}
                    href={ad.target_link}
                    target="_blank"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full flex items-stretch"
                >
                    <div className="flex-[1.2] p-6 lg:p-8 flex flex-col justify-center text-right z-10 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Sponsored Partner
                            </span>
                        </div>

                        <h4 className="text-xl md:text-2xl font-black text-[#001246] leading-tight mb-4 line-clamp-2">
                            {ad.title}
                        </h4>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="bg-[#001246] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-brand-red transition-colors duration-300 shadow-sm">
                                تفاصيل العرض
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 font-mono">
                                {getDomain(ad.target_link)}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden bg-slate-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 w-24"></div>

                        <motion.img
                            key={ad.image_url}
                            src={getImagePath(ad.image_url)}
                            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        />

                        <div className="absolute top-4 left-4 z-20">
                            <span className="text-[8px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded backdrop-blur-sm bg-white/30">
                                AD
                            </span>
                        </div>
                    </div>
                </motion.a>
            </AnimatePresence>

            {ads.length > 1 && (
                <div className="absolute bottom-4 right-8 z-20 flex gap-1.5">
                    {ads.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-4 bg-[#001246]' : 'w-1 bg-slate-200'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
