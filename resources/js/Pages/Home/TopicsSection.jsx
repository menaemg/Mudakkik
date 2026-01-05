import React, { useEffect } from 'react';
import { FaArrowLeft, FaBell, FaBolt } from 'react-icons/fa';
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

const TopicCard = ({ topic }) => (
    <Link href={route('posts.index', { category: topic.slug || topic.name })} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden border border-gray-100 block">
        <div className="h-28 overflow-hidden relative">
            <img
                src={topic.representative_image ? (topic.representative_image.startsWith('http') ? topic.representative_image : `/storage/${topic.representative_image}`) : '/assets/images/post.webp'}
                alt={topic.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    if (e.target.src !== '/assets/images/post.webp') {
                        e.target.src = '/assets/images/post.webp';
                    }
                }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="p-4 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-brand-blue transition-colors">{topic.name}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{topic.posts_count || 0} مقال</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                 <FaArrowLeft className="text-[10px]" />
            </div>
        </div>
    </Link>
);

const AlertCard = ({ image, category, title, author, date, delay, slug }) => (
    <Link href={route('posts.show', slug || '#')} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-brand-red/30 transition-all duration-300 h-full group block" data-aos="fade-up" data-aos-delay={delay}>
        <div className="w-full md:w-40 h-48 md:h-auto shrink-0 relative overflow-hidden">
             <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute top-2 right-2 md:hidden">
                <Badge className="bg-red-600 hover:bg-red-700">{category}</Badge>
             </div>
        </div>
        <div className="p-5 flex flex-col justify-center flex-1">
             <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="hidden md:flex text-[#b20e1e] border-[#b20e1e]/20 bg-red-50 hover:bg-red-100 text-[10px] font-bold">
                    {category}
                </Badge>
                <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                    <FaBolt size={10} className="text-yellow-500" /> عاجل
                </span>
             </div>
            <h3 className="text-lg font-bold leading-snug text-gray-900 mb-3 group-hover:text-[#b20e1e] transition-colors line-clamp-2">
                {title}
            </h3>
             <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
                <Avatar className="w-6 h-6 border border-gray-200">
                    <AvatarImage src={author.img} />
                    <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">{author.name}</span>
                <span className="text-gray-300">|</span>
                <span>{date}</span>
            </div>
        </div>
    </Link>
);

export default function TopicsSection({ topics = [], ads }) {

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const sectionAd = ads?.['home_topics_bottom']?.[0];

    return (
        <section className="container mx-auto px-4 py-16 bg-gray-50/30">

            <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                <div className="flex flex-col">
                    <span className="text-[#b20e1e] font-bold text-xs tracking-widest uppercase mb-1">اكتشف</span>
                    <h2 className="text-3xl font-black text-gray-900">تصفح حسب الموضوع</h2>
                </div>
            </div>

            <div className="mb-16 px-8 relative" data-aos="fade-up">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                        direction: 'rtl',
                    }}
                    plugins={[
                        Autoplay({
                          delay: 3000,
                          stopOnInteraction: false,
                          stopOnMouseEnter: true,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ms-4 py-4">
                        {topics.map((topic) => (
                            <CarouselItem key={topic.id} className="ps-4 basis-1/2 md:basis-1/3 lg:basis-1/5 select-none">
                                <TopicCard topic={topic} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="hidden md:block">
                        <CarouselPrevious className="bg-white hover:bg-[#b20e1e] hover:text-white border-gray-200 shadow-sm" />
                        <CarouselNext className="bg-white hover:bg-[#b20e1e] hover:text-white border-gray-200 shadow-sm" />
                    </div>
                </Carousel>
            </div>

            <div className="flex items-center gap-3 mb-6" data-aos="fade-right">
                <div className="p-2 bg-red-100 text-[#b20e1e] rounded-full">
                    <FaBell />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">تنبيهات المحرر</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AlertCard
                    delay="100" category="صحة عامة"
                    title="خطط الانتشار الربيعي تتعطل بسبب عودة ظهور الفيروس المفاجئ"
                    date="25 يوليو, 2025"
                    author={{name: "أندرو أوجيلفي", img: "https://randomuser.me/api/portraits/men/44.jpg"}}
                    image="https://images.unsplash.com/photo-1542259681-dadcd759486b?w=600&fit=crop"
                />
                <AlertCard
                    delay="200" category="كوارث طبيعية"
                    title="إعصار إليرا يضرب ساحل الخليج، آلاف مطالبون بالإخلاء فوراً"
                    date="25 يوليو, 2025"
                    author={{name: "جويل ميسنر", img: "https://randomuser.me/api/portraits/men/52.jpg"}}
                    image="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&fit=crop"
                />
            </div>

            <div className="mt-12 h-28 bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm rounded-xl cursor-pointer hover:border-[#b20e1e]/30 hover:bg-red-50 transition-all duration-300" data-aos="fade-up">
                {sectionAd ? (
                    <a href={sectionAd.target_link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                        <img src={`/storage/${sectionAd.image}`} alt={sectionAd.title} className="w-full h-full object-cover rounded-xl" />
                    </a>
                ) : (
                    <>
                        <span className="font-bold text-gray-500">مساحة إعلانية</span>
                        <span className="text-xs">تواصل معنا</span>
                    </>
                )}
            </div>

        </section>
    );
}
