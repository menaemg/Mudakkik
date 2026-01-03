import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from '@inertiajs/react';

const getImageUrl = (path) => {
    if (!path) return '/assets/images/placeholder.webp';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

const formatDate = (dateString) => {
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString('ar-EG', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

const MainCardSkeleton = () => (
    <div className="h-[450px] md:h-[520px] w-full rounded-lg bg-gray-200 animate-pulse relative overflow-hidden mb-10">
        <div className="absolute bottom-0 right-0 p-10 w-full space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="flex gap-4 pt-4 border-t border-gray-300/30 mt-4">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                <div className="h-4 w-24 bg-gray-300 rounded mt-2"></div>
            </div>
        </div>
    </div>
);

const SubCardSkeleton = () => (
    <div className="flex gap-4 items-start p-3 rounded-lg border border-transparent">
        <div className="w-[110px] h-[85px] shrink-0 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex flex-col pt-1 flex-1 space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

const EditorCardSkeleton = ({ index }) => (
    <div className="flex gap-5 items-start py-4 border-b border-gray-100 last:border-0">
        <div className="text-5xl font-black text-gray-200 select-none">0{index}</div>
        <div className="flex-1 flex flex-col space-y-2 mt-1">
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
        </div>
    </div>
);

const MainFeaturedCard = ({ post }) => {
    if (!post) return <MainCardSkeleton />;

    return (
        <Link href={route('posts.show', post.slug || '#')} className="group cursor-pointer mb-10 relative block" data-aos="fade-up">
            <div className="relative h-[450px] md:h-[520px] w-full overflow-hidden mb-5 rounded-lg shadow-2xl transition-all duration-500 hover:shadow-brand-red/20">
                <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 will-change-transform"
                />

                <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2">
                    <Badge className="bg-[#D00000] hover:bg-red-600 text-white border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                        قصة الغلاف
                    </Badge>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute bottom-0 right-0 p-6 md:p-10 w-full z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg max-w-4xl line-clamp-3">
                        {post.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-200 font-medium border-t border-white/20 pt-4 w-fit">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border-2 border-white/30">
                                <AvatarImage src={post.user?.avatar ? getImageUrl(post.user.avatar) : ''} />
                                <AvatarFallback className="text-black bg-white">{post.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-white font-bold text-base shadow-black drop-shadow-md">
                                {post.user?.name || 'محرر الموقع'}
                            </span>
                        </div>
                        <span className="text-white/50">•</span>
                        <span>{formatDate(post.created_at)}</span>
                        {post.category && (
                             <>
                                <span className="text-white/50">•</span>
                                <span className="text-blue-400 font-bold">{post.category.name}</span>
                             </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const SubFeaturedCard = ({ post, colorClass, delay }) => {
    if (!post) return <SubCardSkeleton />;

    return (
        <Link href={route('posts.show', post.slug || '#')} className="flex gap-4 items-start group cursor-pointer p-3 r
        ounded-lg hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all
        duration-300 border border-transparent hover:border-gray-100" data-aos="fade-up" data-aos-delay={delay}>
            <div className="w-[110px] h-[85px] shrink-0 overflow-hidden rounded-md shadow-sm relative bg-gray-100">
                <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover transition-transform
                duration-500 group-hover:scale-110" />
                <div className={`absolute bottom-0 w-full h-1 ${colorClass.replace('text-', 'bg-')}`}></div>
            </div>
            <div className="flex flex-col pt-1 flex-1">
                <span className={`text-[10px] font-bold mb-1.5 uppercase tracking-wide flex items-center gap-1 ${colorClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')}`}></span>
                    {post.category?.name || 'عام'}
                </span>
                <h3 className="font-bold text-[15px] leading-snug text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                </h3>
            </div>
        </Link>
    );
};

const EditorsChoiceCard = ({ post, number, delay }) => {
    if (!post) return <EditorCardSkeleton index={number} />;

    return (
        <Link href={route('posts.show', post.slug || '#')} className="flex gap-5 group cursor-pointer
        items-start py-4 border-b border-gray-100 last:border-0
         relative" data-aos="fade-left" data-aos-delay={delay}>
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#D00000]
            group-hover:h-full transition-all duration-300 rounded-full"></div>

            <span className="text-5xl font-black text-gray-100 group-hover:text-[#D00000]/10
            transition-colors leading-none -mt-2 select-none">
                {String(number).padStart(2, '0')}
            </span>

            <div className="flex-1 flex flex-col z-10">
                <Badge variant="outline" className="w-fit mb-2 text-[10px] border-gray-200
                text-gray-500 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                    {post.category?.name || 'مختارات'}
                </Badge>
                <h3 className="font-bold text-[16px] leading-snug text-gray-900 group-hover:text-blue-700
                transition-colors mb-2 line-clamp-2">
                    {post.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <span>بواسطة</span>
                    <span className="text-gray-600 font-bold underline decoration-gray-200 underline-offset-2">
                        {post.user?.name || 'المحرر'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

const SectionHeader = ({ title }) => (
    <div className="flex items-end justify-between border-b border-gray-200 pb-3 mb-8">
        <h2 className="text-2xl font-black text-gray-900 relative pl-4">
            {title}
            <span className="absolute -bottom-[13px] right-0 w-[40px] h-[4px] bg-[#D00000] rounded-t-sm"></span>
        </h2>
    </div>
);

export default function FeaturedNews({ featured }) {
    const mainPost = featured?.main;
    const subPosts = featured?.subs && featured.subs.length > 0 ? featured.subs : [null, null, null, null];
    const editorsPosts = featured?.editors && featured.editors.length > 0 ? featured.editors : [null, null, null, null];

    const subColors = ["text-orange-600", "text-green-600", "text-blue-600", "text-purple-600"];

    return (
        <section className="container mx-auto px-4 py-16 lg:py-20 bg-gray-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                <div className="lg:col-span-8 flex flex-col">
                    <SectionHeader title="أخبار مميزة" />

                    <MainFeaturedCard post={mainPost} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                        {subPosts.map((post, index) => (
                            <SubFeaturedCard
                                key={post?.id || index}
                                post={post}
                                colorClass={subColors[index % subColors.length]}
                                delay={(index + 1) * 100}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col lg:pl-8 lg:border-r lg:border-gray-200/60 h-full">
                    <SectionHeader title="اختيارات المحرر" />

                    <div className="flex flex-col gap-2">
                        {editorsPosts.map((post, index) => (
                            <EditorsChoiceCard
                                key={post?.id || index}
                                post={post}
                                number={index + 1}
                                delay={(index + 1) * 100}
                            />
                        ))}
                    </div>

                    <div className="mt-10 relative overflow-hidden rounded-lg group cursor-pointer shadow-lg" data-aos="zoom-in">
                        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&fit=crop"
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" alt="Ad"/>
                        <div className="absolute inset-0 bg-blue-900/80 flex flex-col items-center justify-center
                        text-center p-6 opacity-90 group-hover:opacity-100 transition-opacity">
                            <h4 className="text-white font-black text-2xl mb-2">النشرة البريدية</h4>
                            <p className="text-white/80 text-sm mb-4">كن أول من يعرف أهم الأخبار</p>
                            <button className="bg-white text-blue-900 font-bold py-2 px-6 rounded-full
                            hover:shadow-lg hover:scale-105 transition-all">اشترك مجاناً</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
