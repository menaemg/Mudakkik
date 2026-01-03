import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Ticker({ news = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (news.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [news.length, isPaused]);

    if (news.length === 0) return null;

    return (
        <div
            className="bg-gradient-to-r from-[#8a0008] via-[#b20e1e] to-[#8a0008] text-white h-10 flex items-center relative z-30 overflow-hidden shadow-inner border-t border-red-900/50"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto flex justify-between items-center px-4 h-full relative">
                <div className="absolute right-0 h-full z-20 flex items-center pr-4 pl-8 bg-gradient-to-l from-[#8a0008] via-[#b20e1e] to-transparent">
                    <div className="bg-white text-[#b20e1e] font-black text-[10px] md:text-xs uppercase px-3 py-1 transform skew-x-[-10deg] shadow-md tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse block transform skew-x-[10deg]"></span>
                        <span className="transform skew-x-[10deg]">عاجل</span>
                    </div>
                </div>


                <div className="flex-1 h-full flex items-center mr-32 overflow-hidden relative">
                    <div className="w-full transition-opacity duration-500">
                        <Link
                            href={route('articles.show', news[currentIndex]?.slug || '#')}
                            className="text-xs md:text-sm font-medium text-white hover:text-yellow-300 transition-colors block truncate"
                        >
                            {news[currentIndex]?.title}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
