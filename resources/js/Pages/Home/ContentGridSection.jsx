import React, { useEffect } from 'react';
import { getImagePath } from '@/utils';
import { FaFacebookF,
   FaInstagram,
   FaTwitter,
   FaBolt,
   FaClock
  } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from '@inertiajs/react';

const SectionLabel = ({ title, colorClass = "bg-black" }) => (
    <div className="mb-6 border-b-2 border-gray-100 flex items-center justify-between font-sans">
        <h2 className={`${colorClass} text-white px-4 py-1.5 font-bold text-sm sm:text-base relative top-[2px] shadow-sm`}>
            {title}
        </h2>
    </div>
);

const DontMissCard = ({ post, delay }) => (
    <Link
        href={route('posts.show', post.slug)}
        // Responsive gap and layout
        className="flex gap-3 sm:gap-5 mb-6 group cursor-pointer border-b border-gray-50
        last:border-0 pb-6 last:pb-0 hover:bg-gray-50/50 p-2 rounded-lg transition-colors"
        data-aos="fade-up"
        data-aos-delay={delay}
    >
        {/* Responsive image size */}
        <div className="w-[120px] sm:w-[160px] h-[90px] sm:h-[110px] shrink-0 overflow-hidden rounded-lg shadow-sm relative">
            <img
                src={getImagePath(post.image_url)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>
        <div className="flex flex-col justify-between py-1 text-right">
            <div>
                <Badge className="w-fit bg-blue-600 hover:bg-blue-700
                text-white border-0 mb-2 px-2 py-0.5 text-[10px] rounded-sm shadow-sm">
                    {post.category?.name}
                </Badge>
                <h3 className="font-bold text-sm sm:text-[15px] leading-snug
                text-gray-900 group-hover:text-brand-blue
                transition-colors line-clamp-2">
                    {post.title}
                </h3>
            </div>
            <div className="flex items-center justify-end gap-2 text-[10px] sm:text-[11px] text-gray-400 mt-2 font-medium">
                <span>{post.formatted_date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-gray-600">{post.user?.name}</span>
            </div>
        </div>
    </Link>
);

const BreakingNewsCard = ({ post }) => {
    if (!post) return null;
    return (
        // Responsive height and padding
        <Link href={route('posts.show', post.slug)} className="relative group cursor-pointer h-full min-h-[350px] sm:min-h-[450px]
        rounded-xl overflow-hidden shadow-lg
        hover:shadow-2xl transition-all duration-300 block" data-aos="zoom-in">
            <img
                src={getImagePath(post.image_url)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-black/20 to-transparent opacity-90"></div>

            <div className="absolute bottom-0 right-0 p-4 sm:p-6 md:p-8 w-full text-right text-white z-10">
                <div className="flex items-center justify-end gap-2 mb-4">
                    <span className="bg-red-600/90 backdrop-blur-sm text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg border border-red-500">
                        تحديث مباشر
                    </span>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                      bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                </div>
                 {/* Responsive typography */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-red-100 transition-colors drop-shadow-md">
                    {post.title}
                </h2>
                <div className="flex items-center justify-end gap-3 text-xs text-gray-200 border-t border-white/20 pt-4 font-medium">
                    <span>{post.source || 'مدقق نيوز'}</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <span className="flex items-center gap-1">{post.created_at_human} <FaClock className="text-red-400"/></span>
                </div>
            </div>
        </Link>
    );
};

const JustForYouItem = ({ post }) => (
    <Link href={route('posts.show', post.slug)} className="flex gap-4 mb-4 group cursor-pointer border-b
    border-gray-50 pb-3 last:border-0 last:pb-0 hover:bg-gray-50/50 p-2
    rounded-lg
    transition-colors
    text-right justify-end">
        <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-brand-red mb-1 uppercase tracking-wide">{post.category?.name}</span>
            <h4 className="font-bold text-sm leading-snug text-gray-800 group-hover:text-brand-blue transition-colors line-clamp-2">
                {post.title}
            </h4>
        </div>
        <div className="w-[70px] h-[70px] shrink-0 overflow-hidden rounded-lg shadow-sm">
            <img src={getImagePath(post.image_url)} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
    </Link>
);

export default function ContentGridSection({ dontMissPosts = [], breakingPost = null, forYouPosts = [] }) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50/50" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-8 items-start">

                    <div className="lg:col-span-5 flex flex-col">
                        <SectionLabel title="لا تفوت" />
                        <div className="flex flex-col gap-1">
                            {dontMissPosts.length > 0 ? dontMissPosts.map((post, index) => (
                                <DontMissCard key={post.id} post={post} delay={index * 100} />
                            )) : <p className="text-center text-gray-400 py-10">لا توجد أخبار حالياً</p>}
                        </div>
                    </div>

                    <div className="lg:col-span-4 h-full flex flex-col">
                        <SectionLabel title="خبر عاجل" colorClass="bg-red-600" />
                        <div className="flex-1">
                            <BreakingNewsCard post={breakingPost} />
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col">
                        <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-100 rounded-xl mb-8">
                            <h3 className="font-bold text-sm text-gray-900 mb-5 text-center border-b border-gray-50 pb-3">تواصل معنا</h3>
                            <div className="flex justify-around">
                                <div className="flex flex-col items-center gap-2
                                group cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex
                                    items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <FaFacebookF size={20} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <FaTwitter size={20} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr
                                    from-yellow-400 via-red-500 to-purple-500 text-white flex
                                    items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <FaInstagram size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-red text-white px-4 py-2
                        font-bold text-sm mb-5 shadow-md rounded-sm flex items-center justify-between">
                            <FaBolt className="text-yellow-400" />
                            <span>خصيصاً لك</span>
                        </div>

                        <div className="flex flex-col bg-white p-4
                        border border-gray-100 rounded-xl shadow-sm">
                            {forYouPosts.length > 0 ? forYouPosts.map((post) => (
                                <JustForYouItem key={post.id} post={post} />
                            )) : <p className="text-center text-gray-400 py-5">لا توجد اقتراحات</p>}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
