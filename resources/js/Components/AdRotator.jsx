import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getImagePath } from '@/utils/imagePaths';

const getDomain = (url) => {
    try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '');
    } catch (e) {
        return 'زيارة الموقع';
    }
};

export default function AdRotator({
    ads = [],
    interval = 6000,
    className = "",
    variant = "default", // "default" | "compact" | "wide"
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!ads || ads.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, interval);
        return () => clearInterval(timer);
    }, [ads?.length, interval]);

    if (!ads || ads.length === 0) return null;

    const ad = ads[currentIndex];

    // Compact variant - minimal design for sidebar
    if (variant === "compact") {
        return (
            <motion.a
                href={ad.target_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block relative overflow-hidden rounded-2xl group ${className}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={getImagePath(ad.image_url)}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black text-gray-500 px-2 py-1 rounded-full uppercase tracking-wider">
                            إعلان
                        </span>
                    </div>

                    <div className="absolute bottom-0 right-0 left-0 p-4">
                        <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-2">
                            {ad.title}
                        </h4>
                        <span className="inline-flex items-center gap-1.5 text-white/70 text-[10px] font-medium">
                            <FaExternalLinkAlt className="text-[8px]" />
                            {getDomain(ad.target_link)}
                        </span>
                    </div>
                </div>
            </motion.a>
        );
    }

    // Wide variant - full width banner with prominent image
    if (variant === "wide") {
        return (
            <div className={`relative overflow-hidden rounded-2xl h-32 ${className}`}>
                {/* Background Image */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={ad.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={getImagePath(ad.image_url)}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/95 via-slate-900/80 to-slate-900/40" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <a
                    href={ad.target_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 h-full flex items-center justify-between px-6 md:px-8 group"
                >
                    {/* Left Side - CTA Button */}
                    <div className="shrink-0">
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-5 py-2.5 rounded-full border border-white/20 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 shadow-lg">
                            <FaExternalLinkAlt className="text-[10px]" />
                            زيارة الموقع
                        </span>
                    </div>

                    {/* Right Side - Text Content */}
                    <div className="text-right flex-1 min-w-0 mx-6">
                        <div className="flex items-center justify-end gap-2 mb-2">
                            <span className="text-slate-400 text-xs font-medium" dir="ltr">
                                {getDomain(ad.target_link)}
                            </span>
                            <span className="bg-amber-500/20 text-amber-400 text-[9px] font-black px-2.5 py-1 rounded-full">
                                شريك إعلاني
                            </span>
                        </div>
                        <h4 className="text-white font-bold text-lg md:text-xl leading-snug line-clamp-1">
                            {ad.title}
                        </h4>
                    </div>
                </a>

                {/* Pagination Dots */}
                {ads.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {ads.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default variant - Card style
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 group ${className}`}>
            <AnimatePresence mode='wait'>
                <motion.a
                    key={ad.id}
                    href={ad.target_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="block"
                >
                    {/* Image Section */}
                    <div className="relative h-32 overflow-hidden">
                        <motion.img
                            src={getImagePath(ad.image_url)}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* AD Badge */}
                        <div className="absolute top-3 left-3">
                            <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                                AD
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 bg-gradient-to-b from-white to-slate-50/50">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    إعلان ممول
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                                    {ad.title}
                                </h4>
                            </div>

                            <div className="shrink-0 mt-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white group-hover:bg-brand-red transition-colors">
                                    <FaExternalLinkAlt className="text-[10px]" />
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-medium text-slate-400" dir="ltr">
                                {getDomain(ad.target_link)}
                            </span>

                            {ads.length > 1 && (
                                <div className="flex gap-1">
                                    {ads.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-3 bg-slate-900' : 'w-1 bg-slate-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.a>
            </AnimatePresence>
        </div>
    );
}
