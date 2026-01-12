import React, {
    useEffect
} from 'react';
import { Button } from "@/components/ui/button";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaBolt, FaStar } from 'react-icons/fa';
import { getImagePath } from '@/utils';
import AdRotator from '@/Components/AdRotator';
import { motion } from 'framer-motion';

const BannerSkeleton = () => (
    <section className="w-full bg-slate-50 py-8 md:py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl bg-gray-200 animate-pulse overflow-hidden border border-gray-100">
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 w-full md:w-2/3 lg:w-1/2 z-10">
                    <div className="w-32 h-6 bg-gray-300 rounded-full mb-4"></div>
                    <div className="w-3/4 h-10 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="w-1/2 h-10 bg-gray-300 rounded-lg mb-6"></div>
                    <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-2/3 h-4 bg-gray-300 rounded mb-8"></div>
                    <div className="w-48 h-12 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    </section>
);

export default function BannerSection({ post, ad }) {

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    if (!post && !ad) {
        return <BannerSkeleton />;
    }

    if (ad && !post) {
        const adsToDisplay = Array.isArray(ad) ? ad : [ad];
        return (
            <section className="w-full py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50" data-aos="fade-up">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="inline-flex items-center gap-2
                            bg-gradient-to-r from-amber-500/10
                            to-red-500/10 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-200/50">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                                    <FaStar size={12} />
                                </motion.div>
                                عروض حصرية مختارة بعناية
                            </span>
                        </motion.div>
                    </div>

                    <div className="relative hidden lg:block">
                        <motion.div
                            className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-transparent rounded-full blur-3xl pointer-events-none"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-300/20 to-transparent rounded-full blur-3xl pointer-events-none"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative bg-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 group"
                    >
                        <div className="relative">
                            <AdRotator
                                ads={adsToDisplay}
                                variant="banner"
                                interval={5000}
                                className="w-full"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    const content = {
        image: getImagePath(post?.image, "/assets/images/banner-placeholder.webp"),
        title: post?.title,
        description: post?.excerpt || post?.description,
        category: post?.category?.name || "تغطية حصرية",
        link: post?.slug ? route('posts.show', post.slug) : '#'
    };

    return (
        <section className="w-full py-8 md:py-12 mb-8" data-aos="fade-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl border border-gray-100">
                    <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 will-change-transform"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/95 via-black/70 md:via-black/60 to-transparent opacity-90"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-16 w-full md:w-2/3 lg:w-1/2 z-10">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <span className="text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 bg-brand-red animate-pulse shadow-lg">
                                <FaBolt />
                                {content.category}
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 md:mb-6 drop-shadow-xl group-hover:text-gray-100 transition-colors line-clamp-3 md:line-clamp-none">
                            {content.title}
                        </h2>

                        <p className="text-gray-200 text-xs sm:text-sm md:text-base mb-6 md:mb-8 line-clamp-2 leading-relaxed opacity-90 max-w-lg">
                            {content.description}
                        </p>

                        <div className="flex gap-4">
                            <a href={content.link} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto rounded-full px-6 py-3 sm:px-8 sm:py-6 text-sm sm:text-base font-bold shadow-lg hover:-translate-y-1 transition-all bg-brand-red hover:bg-red-700 text-white shadow-red-900/50">
                                    استكشف التغطية الكاملة
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
