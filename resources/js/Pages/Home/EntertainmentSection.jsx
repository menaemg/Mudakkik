import React, { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaPlay, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const getImageUrl = (path) => {
    if (!path) return '/assets/images/placeholder.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const MainCardSkeleton = () => (
    <div className="relative h-[600px] w-full rounded-xl bg-gray-200 animate-pulse overflow-hidden">
        <div className="absolute bottom-8 right-8 left-8 p-8 space-y-4">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded"></div>
            <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-300/30">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="space-y-2"> <div className="h-3 w-20 bg-gray-300 rounded"></div> <div className="h-2 w-12 bg-gray-300 rounded"></div> </div>
            </div>
        </div>
    </div>
);

const VerticalCardSkeleton = () => (
    <div className="flex flex-col mb-8 last:mb-0 p-3">
        <div className="h-48 w-full bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
        <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-full bg-gray-200 rounded"></div>
        </div>
    </div>
);

const SideItemSkeleton = () => (
    <div className="mb-6 border-b border-gray-100 pb-4 last:border-0">
        <div className="h-3 w-12 bg-gray-100 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
        <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
        </div>
    </div>
);

const MainEntertainCard = ({ post }) => (
    <Link href={route('posts.show', post.slug)} className="relative h-[600px] w-full group cursor-pointer overflow-hidden rounded-xl shadow-2xl block" data-aos="zoom-in">
        <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-8 right-8 left-8 bg-[#b20e1e]/95 backdrop-blur-sm p-8 text-white shadow-xl border-t-4 border-white/20 rounded-sm">
            <span className="text-[10px] font-black uppercase mb-3 block text-white/80 tracking-widest">★ تغطية خاصة</span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 drop-shadow-md">{post.title}</h2>
            <div className="flex items-center gap-3 text-xs text-white/90 font-medium border-t border-white/20 pt-4">
                <Avatar className="w-8 h-8 border-2 border-white/30">
                    <AvatarImage src={getImageUrl(post.user?.avatar)} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-bold text-white">{post.user?.name}</span>
                    <span className="text-[10px] text-white/70">محرر فني</span>
                </div>
            </div>
        </div>
    </Link>
);

const VerticalCard = ({ post, delay }) => (
    <Link href={route('posts.show', post.slug)} className="flex flex-col mb-8 last:mb-0 group cursor-pointer bg-white p-3 rounded-xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 block" data-aos="fade-up" data-aos-delay={delay}>
        <div className="h-48 overflow-hidden rounded-lg mb-3 relative shadow-sm">
            <img src={getImageUrl(post.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50"><FaPlay size={12} className="ml-1" /></div>
            </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#b20e1e] mb-2 font-black uppercase tracking-wide">
            <span>{post.category?.name}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400 font-bold">{new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
        </div>
        <h3 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-[#b20e1e] transition-colors line-clamp-2">{post.title}</h3>
    </Link>
);

const SideListItem = ({ post, delay }) => (
    <Link href={route('posts.show', post.slug)} className="mb-6 border-b border-gray-100 pb-4 last:border-0 group hover:translate-x-[-5px] transition-transform duration-300 block text-right" data-aos="fade-left" data-aos-delay={delay}>
        <span className="text-[10px] text-[#b20e1e] font-bold block mb-1 uppercase">أخبار الفن</span>
        <h4 className="font-bold text-[15px] leading-snug text-gray-900 mb-2 group-hover:text-[#b20e1e] transition-colors">{post.title}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <Avatar className="w-5 h-5"><AvatarImage src={getImageUrl(post.user?.avatar)} /><AvatarFallback>U</AvatarFallback></Avatar>
            <span className="font-medium text-gray-700">{post.user?.name}</span>
        </div>
    </Link>
);

export default function EntertainmentSection({ data = [] }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quad',
        });
    }, []);

    const isLoading = !data || data.length === 0;

    return (
        <section className="container mx-auto px-4 py-16 bg-gray-50/30">
            <div className="mb-8 border-b border-gray-200 flex justify-between items-end pb-2">
                <h2 className="bg-black text-white px-6 py-2 font-black text-lg inline-block relative top-[1px] shadow-md">ترفيه وفنون</h2>
                <Link href={route('posts.index', {category: 'entertainment'})} className="text-xs font-bold text-gray-500 hover:text-[#b20e1e] flex items-center gap-1 transition-colors mb-1 group">
                    عرض المزيد <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6">
                    {isLoading ? <MainCardSkeleton /> : <MainEntertainCard post={data[0]} />}
                </div>

                <div className="lg:col-span-3 flex flex-col h-full">
                    {isLoading ? (
                        <> <VerticalCardSkeleton /> <VerticalCardSkeleton /> </>
                    ) : (
                        <>
                            {data[1] && <VerticalCard post={data[1]} delay="100" />}
                            {data[2] && <VerticalCard post={data[2]} delay="200" />}
                        </>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <div className="h-[200px] bg-gradient-to-br from-pink-600 to-rose-700 mb-6 flex flex-col items-center justify-center text-white text-center p-6 rounded-xl shadow-xl relative overflow-hidden group">
                        <h4 className="text-xl font-black mb-2 drop-shadow-md">أجندة الفعاليات</h4>
                        <p className="text-[10px] text-white/80 mb-4">لا تفوت أهم عروض الأسبوع</p>
                        <button className="bg-white text-rose-600 px-4 py-1.5 text-[10px] font-bold rounded-full hover:scale-105 transition-transform">اشترك الآن</button>
                    </div>

                    <div className="flex flex-col bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                        {isLoading ? (
                            <> <SideItemSkeleton /> <SideItemSkeleton /> <SideItemSkeleton /> </>
                        ) : (
                            data.slice(3, 6).map((post, i) => (
                                <SideListItem key={post.id} post={post} delay={300 + (i * 100)} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
