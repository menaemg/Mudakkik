import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { FaExternalLinkAlt, FaStar, FaArrowLeft, FaBolt } from 'react-icons/fa';
import { getImagePath } from '@/utils';

const getDomain = (url) => {
    try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '');
    } catch (e) {
        return 'زيارة الموقع';
    }
};

const CATCHY_PHRASES = [
    "فرصة لا تعوض",
    "عرض حصري",
    "اكتشف المزيد",
    "الأكثر طلباً"
];

const Particles = ({ count = 20 }) => {
    const particles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white/50"
                    style={{
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};


export default function AdRotator({
    ads = [],
    interval = 5000,
    className = "",
    variant = "compact",
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const randomPhrase = CATCHY_PHRASES[currentIndex % CATCHY_PHRASES.length];

    useEffect(() => {
        if (!ads || ads.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, interval);
        return () => clearInterval(timer);
    }, [ads?.length, interval]);

    if (!ads || ads.length === 0) {
        return null;
    }

    const ad = ads[currentIndex];

    if (variant === "compact") {
        return (
            <div className={`relative overflow-hidden rounded-xl bg-gray-900 shadow-lg group w-full h-[150px] md:h-[160px] cursor-pointer ${className}`}>

                <AnimatePresence mode='wait'>
                    <motion.a
                        key={ad.id}
                        href={ad.target_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 block w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.img
                            src={getImagePath(ad.image_url)}
                            alt={ad.title}
                            className="w-full h-full object-cover transition-transform duration-700"
                            whileHover={{ scale: 1.1 }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3 z-30">
                            <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider group-hover:bg-brand-red transition-colors">
                                AD
                            </span>
                        </div>

                        <div className="absolute bottom-0 w-full p-4 z-30 flex items-end justify-between">

                            <div className="flex-1 pl-3 text-right">
                                <span className="text-[10px] text-amber-400 font-bold mb-0.5 block truncate opacity-90" dir="ltr">
                                    {getDomain(ad.target_link)}
                                </span>

                                <h3 className="text-white font-bold text-sm md:text-[15px] leading-snug line-clamp-2 drop-shadow-sm group-hover:text-amber-100 transition-colors">
                                    {ad.title}
                                </h3>
                            </div>

                            <motion.div
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300 shadow-lg"
                            >
                                <FaExternalLinkAlt size={10} />
                            </motion.div>
                        </div>
                    </motion.a>
                </AnimatePresence>

                {ads.length > 1 && (
                    <div className="absolute top-3 right-3 flex gap-1 z-30">
                        {ads.map((_, idx) => (
                            <div key={idx} className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'w-3 bg-amber-500' : 'w-1 bg-white/30'}`} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (variant === "banner") {
        return (
            <div
                className={`relative overflow-hidden rounded-[3rem] h-[280px] md:h-[380px] shadow-2xl group border border-gray-800 bg-gray-900 ${className}`}>
                <div
                    className="absolute inset-0 w-full h-full"
                >
                    <Particles />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20 pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, duration: 3, repeatDelay: 4, ease: "easeInOut" }}
                    />

                    <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl z-10"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl z-10"></div>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={ad.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.img
                                src={getImagePath(ad.image_url)}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1 }} animate={{ scale: 1.08 }}
                                transition={{ duration: interval / 1000, ease: "linear" }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 pointer-events-none" />

                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 z-30 pointer-events-none"></div>

                            <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-16 py-6 z-20">
                                <div className="max-w-2xl w-full text-right">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-black mb-6 shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-300/30">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                                            <FaStar />
                                        </motion.div>
                                        <span>عرض حصري مميز</span>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl"
                                        style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
                                        >
                                        {ad.title}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="text-gray-200 text-base md:text-lg mb-6 line-clamp-2 leading-relaxed max-w-2xl drop-shadow-lg">
                                        {ad.description || "اكتشف أفضل العروض الحصرية والخدمات المميزة."}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="flex items-center justify-end gap-3 mb-8">
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="text-amber-400"
                                            >
                                                <FaBolt size={16} />
                                            </motion.div>
                                            <span className="text-lg md:text-xl font-black text-amber-300" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.7)' }}>{randomPhrase}</span>
                                        </div>
                                    </motion.div>

                                    <motion.a
                                        href={ad.target_link} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-red-500 text-black font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 text-base md:text-lg group/btn border border-amber-300/50"
                                        whileHover={{ scale: 1.08, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>انقر الآن</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <FaArrowLeft size={16} />
                                        </motion.div>
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {ads.length > 1 && (
                        <motion.div className="absolute bottom-6 left-6 flex gap-2 z-30">
                            {ads.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`rounded-full transition-all ${idx === currentIndex ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-white/30'}`}
                                    animate={{
                                        width: idx === currentIndex ? 32 : 8,
                                        height: 8,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }

    if (variant === "wide") {
        return (
            <div className={`relative overflow-hidden rounded-xl h-24 md:h-32 shadow-lg border border-gray-100/10 bg-gray-800 ${className}`}>
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20 pointer-events-none"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 5, ease: "easeInOut" }}
                />

                <AnimatePresence mode='wait'>
                    <motion.a
                        key={ad.id}
                        href={ad.target_link} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 flex w-full h-full items-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 w-full h-full">
                            <img src={getImagePath(ad.image_url)} className="w-full h-full object-cover opacity-20" alt="bg" />
                            <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/95 to-transparent" />
                        </div>

                        <div className="relative z-10 flex items-center justify-between w-full px-6">
                            <div className="flex-1">
                                <span className="text-amber-500 text-[9px] font-bold uppercase tracking-widest block mb-1">ممول</span>
                                <h3 className="text-lg font-bold text-white line-clamp-1">{ad.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-300">{randomPhrase}</span>
                                    <FaBolt size={10} className="text-amber-500 animate-pulse" />
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white ml-4 shrink-0 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300"
                            >
                                <FaExternalLinkAlt size={12} />
                            </motion.div>
                        </div>
                    </motion.a>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gray-900 shadow-md group h-full w-full ${className}`}>
             <AnimatePresence mode='wait'>
                <motion.a
                    key={ad.id}
                    href={ad.target_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 block w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={getImagePath(ad.image_url)}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-&lsqb;2s&rsqb; group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                    <div className="absolute top-3 left-3 z-10">
                         <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                            AD
                        </span>
                    </div>

                    <div className="absolute bottom-0 right-0 w-full p-4 z-10">
                        <div className="flex justify-between items-end gap-2">
                            <div className="flex-1 min-w-0">
                                <span className="text-[9px] text-amber-400 font-bold mb-0.5 block truncate" dir="ltr">
                                    {getDomain(ad.target_link)}
                                </span>
                                <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow-sm group-hover:text-amber-100 transition-colors">
                                    {ad.title}
                                </h4>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300">
                                <FaExternalLinkAlt size={10} />
                            </div>
                        </div>
                    </div>
                </motion.a>
            </AnimatePresence>
             {ads.length > 1 && (
                <div className="absolute top-3 right-3 flex gap-1 z-20">
                    {ads.map((_, idx) => (
                        <div key={idx} className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'w-3 bg-amber-500' : 'w-1 bg-white/30'}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
