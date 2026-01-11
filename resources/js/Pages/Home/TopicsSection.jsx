import React, { useEffect } from 'react';
import AdRotator from '@/Components/AdRotator';
import { FaArrowLeft, FaBell, FaBolt, FaClock } from 'react-icons/fa';
import Autoplay from "embla-carousel-autoplay"
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getImagePath } from '@/utils';

const TopicCard = ({ topic }) => (
    <Link href={route('posts.index', { category: topic.slug })}
    className="group cursor-pointer bg-white
    rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1
    transition-all duration-300 h-full overflow-hidden border border-gray-100 block">
        <div className="h-24 md:h-28 overflow-hidden relative">
            <img
                src={getImagePath(topic.representative_image)}
                alt={topic.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="p-3 md:p-4 flex justify-between items-center text-right">
            <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-brand-blue transition-colors">{topic.name}</h3>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">{topic.posts_count || 0} مقال</span>
            </div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                <FaArrowLeft className="text-[8px] md:text-[10px]" />
            </div>
        </div>
    </Link>
);

const AlertCard = ({ post, delay }) => {
    if (!post || !post.slug) {
        return null;
    }
    return (
        <Link href={route('posts.show', post.slug)} className="flex flex-col md:flex-row bg-white rounded-lg md:rounded-xl
        overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-brand-red/30 transition-all
        duration-300 h-full group block text-right" data-aos="fade-up" data-aos-delay={delay}>
            <div className="w-full md:w-48 h-40 md:h-auto shrink-0 relative overflow-hidden">
                <img src={getImagePath(post.image)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-2 right-2 md:hidden">
                    <Badge className="bg-red-600 text-[10px] px-2 py-0.5">{post.category?.name}</Badge>
                </div>
            </div>
            <div className="p-4 md:p-5 flex flex-col justify-center flex-1">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="hidden md:flex text-[#b20e1e] border-[#b20e1e]/20 bg-red-50 hover:bg-red-100 text-[10px] font-bold">
                        {post.category?.name}
                    </Badge>
                    <span className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-400 font-bold">
                        <FaBolt size={10} className="text-yellow-500" /> تنبيه المحرر
                    </span>
                </div>
                <h3 className="text-base md:text-lg font-bold leading-snug text-gray-900 mb-3 group-hover:text-[#b20e1e] transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 mt-auto justify-end flex-wrap">
                    <span>{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-700">{post.user?.name}</span>
                    <Avatar className="w-5 h-5 md:w-6 md:h-6 border border-gray-200">
                        <AvatarImage src={getImagePath(post.user?.avatar)} />
                        <AvatarFallback className="text-[8px] md:text-[10px]">AU</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </Link>
    );
};

export default function TopicsSection({ topics = [], editorAlerts = [], ads }) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const sectionAd = Array.isArray(ads) && ads.length > 0 ? ads[0] : null;

    return (
        <section className="container mx-auto px-4 py-8 md:py-16 bg-gray-50/30" dir="rtl">
            <div className="flex items-end justify-between mb-6 md:mb-8 border-b border-gray-200 pb-4">
                <div className="flex flex-col text-right">
                    <span className="text-[#b20e1e] font-bold text-[10px] md:text-xs tracking-widest uppercase mb-1">اكتشف</span>
                    <h2 className="text-xl md:text-3xl font-black text-gray-900">تصفح حسب الموضوع</h2>
                </div>
            </div>

            <div className="mb-8 md:mb-16 px-0 md:px-8 relative" data-aos="fade-up">
                <Carousel
                    opts={{ align: "start", loop: true, direction: 'rtl' }}
                    plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                    className="w-full"
                >
                    <CarouselContent className="-ms-2 md:-ms-4 py-4">
                        {topics.map((topic) => (
                            <CarouselItem key={topic.id} className="ps-2 md:ps-4 basis-1/2 md:basis-1/3 lg:basis-1/5 select-none">
                                <TopicCard topic={topic} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious className="right-[-40px] left-auto bg-white hover:bg-[#b20e1e] hover:text-white border-gray-200 shadow-sm transition-all" />
                        <CarouselNext className="left-[-40px] right-auto bg-white hover:bg-[#b20e1e] hover:text-white border-gray-200 shadow-sm transition-all" />
                    </div>
                </Carousel>
            </div>

            <div className="flex items-center gap-3 mb-4 md:mb-6 justify-start" data-aos="fade-right">
                <div className="p-1.5 md:p-2 bg-red-100 text-[#b20e1e] rounded-full">
                    <FaBell className="text-sm md:text-base" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900">تنبيهات المحرر</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {editorAlerts && editorAlerts.length > 0 ? (
                    editorAlerts.map((slot, index) => (
                        <AlertCard key={slot.id} post={slot.post} delay={(index + 1) * 100} />
                    ))
                ) : (
                    <div className="col-span-2 py-8 md:py-10 text-center text-sm md:text-base text-gray-400 bg-white rounded-xl border border-dashed">
                        لا توجد تنبيهات محررة متاحة حالياً.
                    </div>
                )}
            </div>

            <div className="mt-8 md:mt-12" data-aos="fade-up">
                {sectionAd ? (
                    <AdRotator
                        ads={[sectionAd]}
                        variant="wide"
                    />
                ) : (
                    <div className="h-20 md:h-24 bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm rounded-xl hover:border-brand-red/30 hover:bg-red-50/50 transition-all duration-300">
                        <span className="font-bold text-gray-500 block text-xs md:text-sm">مساحة إعلانية متوفرة</span>
                        <span className="text-[10px]">تواصل مع الإدارة للإعلان هنا</span>
                    </div>
                )}
            </div>
        </section>
    );
}
