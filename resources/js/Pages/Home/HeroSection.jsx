import React, { useEffect } from 'react';
import { FaChartLine, FaClock } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from '@inertiajs/react';
import AdRotator from '@/Components/AdRotator';

const getImagePath = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/assets/images/post.webp';
};
const SkeletonCard = () => {
    return <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse border border-gray-200 min-h-[80px]"></div>;
};

const LatestNewsCard = ({ category, date, title, image, delay, slug }) => (
    <Link
        href={route('posts.show', slug || '#')}
        className="flex gap-3 items-center p-2 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100 flex-1 min-h-0"
        data-aos="fade-up"
        data-aos-delay={delay}
    >
        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg relative shadow-sm border border-slate-100">
            <img src={getImagePath(image)} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={handleImageError} />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                <span className="text-brand-blue font-bold truncate">{category}</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><FaClock size={8} /> {date}</span>
            </div>
            <h3 className="font-bold text-sm text-[#001246] leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                {title}
            </h3>
        </div>
    </Link>
);

const MainFeatureCard = ({ story }) => (
    <Link
        href={route('posts.show', story?.slug || '#')}
        className="relative h-[400px] lg:h-full w-full rounded-[2rem] overflow-hidden group block shadow-xl border border-slate-100"
        data-aos="zoom-in"
    >
        <img src={getImagePath(story?.image)} alt={story?.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={handleImageError} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001246] via-transparent to-transparent opacity-90"></div>
        <div className="absolute bottom-0 right-0 p-6 lg:p-8 w-full text-white z-10">
            <Badge className="bg-[#D00000] hover:bg-red-700 text-white border-0 mb-3 px-3 py-1 rounded-lg shadow-sm font-bold">
                {story?.category?.name || 'عام'}
            </Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-tight drop-shadow-md group-hover:text-slate-200 transition-colors line-clamp-3">
                {story?.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-300 mt-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border border-white/20">
                        <AvatarImage src={getImagePath(story?.user?.avatar)} />
                        <AvatarFallback className="text-black bg-white">{story?.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold truncate max-w-[150px]">{story?.user?.name}</span>
                </div>
                <span className="hidden lg:inline text-white/50">•</span>
                <span className="hidden lg:inline text-xs">{new Date(story?.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
        </div>
    </Link>
);

const TrendingCard = ({ category, title, image, index, delay, slug, views }) => (
    <Link
        href={route('posts.show', slug || '#')}
        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100 flex-1 min-h-0"
        data-aos="fade-left"
        data-aos-delay={delay}
    >
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-2xl font-black text-slate-200 group-hover:text-[#D00000] italic w-6 text-center shrink-0">{index}</span>
            <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg relative shadow-sm border border-slate-100">
                <img src={getImagePath(image)} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={handleImageError} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-brand-blue font-bold mb-0.5 truncate">{category}</span>
                <h4 className="font-bold text-sm text-[#001246] line-clamp-2 group-hover:text-brand-blue transition-colors leading-snug">{title}</h4>
            </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap mr-2">
            <FaChartLine /> {views}
        </div>
    </Link>
);

const BottomStripItem = ({ title, date, image, slug, delay }) => (
    <Link href={route('posts.show', slug || '#')} className="flex items-center gap-3 p-3 h-28 bg-white rounded-2xl border border-slate-100 hover:border-brand-blue/20 hover:shadow-md transition-all cursor-pointer group" data-aos="fade-up" data-aos-delay={delay}>
        <div className="w-24 h-full shrink-0 overflow-hidden rounded-xl border border-slate-100 relative">
            <img src={getImagePath(image)} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={handleImageError} />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="font-bold text-sm text-[#001246] leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">{title}</h3>
            <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover:scale-150 transition-transform"></span>
                {date}
            </div>
        </div>
    </Link>
);

export default function HeroSection({ hero, ads }) {
    useEffect(() => { AOS.init({ duration: 800, once: true, offset: 50 }); }, []);

    const { main, side, strip, trending } = hero || {};

    const allAds = ads || [];

    const safePosts = strip?.slice(0, 2) || [];

    const finalStrip = [
        { type: 'post', data: safePosts[0] },
        { type: 'ad', data: allAds },
        { type: 'post', data: safePosts[1] },
        { type: 'ad', data: allAds }
    ];

    return (
        <section className="container mx-auto px-4 py-8 lg:py-12 font-sans" dir="rtl">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-stretch lg:h-[550px]">
                <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col h-full">
                    <div className="bg-black text-white px-4 py-2 font-bold text-lg w-fit relative shadow-md mb-4 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[4px] after:bg-brand-red">
                        آخر الأخبار
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-h-0">
                        {side && side.length > 0 ? (
                            side.map((story, index) => (
                                <LatestNewsCard
                                    key={story.id}
                                    delay={100 * (index + 1)}
                                    slug={story.slug}
                                    title={story.title}
                                    category={story.category?.name}
                                    date={new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    image={story.image}
                                />
                            ))
                        ) : [1, 2, 3, 4].map((i) => <div key={i} className="flex-1 bg-gray-100 rounded-xl animate-pulse"></div>)}
                    </div>
                </div>

                <div className="lg:col-span-6 order-1 lg:order-2 h-full">
                    {main ? <MainFeatureCard story={main} /> : <SkeletonCard type="main" />}
                </div>

                <div className="lg:col-span-3 order-3 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-brand-red pb-2 shrink-0">
                        <FaChartLine className="text-brand-red text-xl" />
                        <h2 className="font-black text-xl text-gray-900">الأكثر رواجاً</h2>
                    </div>
                    <div className="bg-white rounded-2xl p-2 border border-slate-50 shadow-sm flex flex-col gap-1 flex-1 min-h-0">
                        {trending && trending.length > 0 ? (
                            trending.map((story, index) => (
                                <TrendingCard
                                    key={story.id}
                                    index={index + 1}
                                    delay={200 + (index * 100)}
                                    slug={story.slug}
                                    title={story.title}
                                    category={story.category?.name}
                                    views={story.views}
                                    image={story.image}
                                />
                            ))
                        ) : [1, 2, 3, 4, 5].map((i) => <div key={i} className="flex-1 bg-gray-100 rounded-xl animate-pulse"></div>)}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-12 mt-16">
                <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {finalStrip.map((item, index) => {
                            if (item.type === 'post') {
                                return item.data ? (
                                    <BottomStripItem
                                        key={`post-${index}`}
                                        delay={100 * (index + 1)}
                                        title={item.data.title}
                                        slug={item.data.slug}
                                        date={new Date(item.data.created_at).toLocaleDateString('ar-EG')}
                                        image={item.data.image}
                                    />
                                ) : <div key={index} className="h-28 bg-gray-100 rounded-2xl animate-pulse"></div>;
                            } else {
                                return (
                                    <div key={`ad-${index}`} data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                                        <AdRotator
                                            ads={item.data}
                                            variant="default"
                                            interval={6000 + (index * 1000)}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-12 w-full" data-aos="fade-up">
                {(!allAds || allAds.length === 0) ? (
                    <div className="w-full h-28 md:h-40 flex items-center justify-center bg-gray-100 border rounded">
                        <div className="text-center">
                            <span className="font-bold text-gray-500 block">مساحة إعلانية متوفرة</span>
                            <span className="text-[10px]">بانر إعلاني </span>
                        </div>
                    </div>
                ) : (
                    <AdRotator
                        ads={allAds}
                        variant="wide"
                    />
                )}
            </div>
        </section>
    );
}
