import React, { useEffect } from 'react';
import { FaBolt, FaArrowLeft } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from '@inertiajs/react';

const getImageUrl = (path) => {
    if (!path) return '/assets/images/placeholder.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formatDate = (dateString) => {
    if(!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;

    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
};

const StoryCardSkeleton = ({ index }) => {
    const isLarge = index === 0 || index === 1;

    return (
        <div
            className={`relative rounded-xl border border-white/5 bg-white/5 animate-pulse overflow-hidden
            ${isLarge ? 'md:col-span-2 h-[400px] lg:h-[500px]' : 'md:col-span-1 h-[350px] lg:h-[500px]'}`}
        >
            <div className="absolute bottom-0 right-0 p-6 md:p-8 w-full flex flex-col justify-end h-full z-10">

                <div className="mb-auto">
                    <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                    <div className="h-6 w-1/2 bg-white/10 rounded"></div>
                    {isLarge && <div className="h-6 w-2/3 bg-white/10 rounded"></div>}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="h-8 w-8 rounded-full bg-white/10"></div>
                    <div className="h-3 w-24 bg-white/10 rounded"></div>
                </div>
            </div>
        </div>
    );
};

const StoryCard = ({ post, index, delay }) => {
    const isLarge = index === 0 || index === 1;

    return (
        <Link
            href={route('posts.show', post.slug)}
            className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-lg border border-white/10 block
            ${isLarge ? 'md:col-span-2 h-[400px] lg:h-[500px]' : 'md:col-span-1 h-[350px] lg:h-[500px]'}`}
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-[#000a2e]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute bottom-0 right-0 p-6 md:p-8 w-full z-10 flex flex-col justify-end h-full">

                <div className="flex justify-between items-start mb-auto">
                     <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-lg backdrop-blur-md border border-white/20
                        ${post.is_breaking ? 'bg-red-600 animate-pulse' : 'bg-white/10'}`}>
                        {post.category?.name || 'عام'}
                     </span>
                </div>

                <h3 className={`font-black text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors drop-shadow-lg line-clamp-2
                    ${isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
                    {post.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-300 font-medium pt-4 border-t border-white/20 group-hover:border-white/40 transition-colors">
                    <div className="flex items-center gap-2">
                            <img src={getImageUrl(post.user?.avatar)} className="w-6 h-6 rounded-full border border-white/30" alt={post.user?.name} />
                            <span className="text-gray-100 font-bold">{post.user?.name}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span>{formatDate(post.created_at)}</span>
                </div>
            </div>
        </Link>
    );
};

export default function TopStories({ stories }) {

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const displayStories = (stories && stories.length > 0)
        ? stories
        : Array(6).fill(null);
    return (
        <section className="bg-[#000a2e] py-16 lg:py-24 font-sans relative overflow-hidden">

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">

                <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <FaBolt className="text-xl text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">أهم قصص اليوم</h2>
                            <p className="text-gray-400 text-sm mt-1 font-medium">الأكثر قراءة وتفاعلاً خلال الـ 48 ساعة الماضية</p>
                        </div>
                    </div>

                    <Link href={route('posts.index')} className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full hover:bg-white/10">
                        عرض الأرشيف الكامل
                        <FaArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayStories.map((post, index) => (
                        post ? (
                            <StoryCard
                                key={post.id}
                                post={post}
                                index={index}
                                delay={(index + 1) * 100}
                            />
                        ) : (
                            <StoryCardSkeleton key={index} index={index} />
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
