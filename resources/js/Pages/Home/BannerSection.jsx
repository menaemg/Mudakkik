import React from 'react';
import { Button } from "@/components/ui/button";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowLeft, FaBolt } from 'react-icons/fa';

export default function BannerSection() {
    return (
        <section className="container mx-auto px-4 py-12 mb-8" data-aos="fade-up">
            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl border border-gray-100">
                <img
                    src="https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=1600&auto=format&fit=crop"
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 will-change-transform"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/60 to-transparent opacity-90"></div>

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3 lg:w-1/2 z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <FaBolt /> تغطية حصرية
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 drop-shadow-xl group-hover:text-gray-100 transition-colors">
                        المرشحون للرئاسة يتصادمون حول الاقتصاد في المناظرة الأخيرة
                    </h2>

                    <p className="text-gray-200 text-sm md:text-base mb-8 line-clamp-2 leading-relaxed opacity-90 max-w-lg">
                        تحليل معمق لأبرز نقاط الخلاف، وكيف ستؤثر السياسات المقترحة على مستقبل الأسواق العالمية والمحلية في العام المقبل.
                    </p>

                    <div className="flex gap-4">
                        <Button className="bg-brand-red hover:bg-red-700 text-white rounded-full px-8 py-6 text-base font-bold shadow-lg hover:shadow-red-900/50 hover:-translate-y-1 transition-all">
                            استكشف التغطية الكاملة
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
