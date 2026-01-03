import React from 'react';
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

const topics = [
    { id: 1, name: 'صحة', count: '5 مقالات', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&fit=crop&q=60' },
    { id: 2, name: 'أعمال', count: '8 مقالات', image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400&fit=crop&q=60' },
    { id: 3, name: 'سياسة', count: '5 مقالات', image: 'https://images.unsplash.com/photo-1529101091760-61df6be34fc8?w=400&fit=crop&q=60' },
    { id: 4, name: 'سفر', count: '5 مقالات', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&fit=crop&q=60' },
    { id: 5, name: 'عالم', count: '28 مقال', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&fit=crop&q=60' },
    { id: 6, name: 'تكنولوجيا', count: '8 مقالات', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&fit=crop&q=60' },
    { id: 7, name: 'رياضة', count: '12 مقال', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&fit=crop&q=60' },
];

const TopicCard = ({ topic }) => (
    <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden border border-gray-100">
        <div className="h-28 overflow-hidden relative">
            <img src={topic.image} alt={topic.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="p-4 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-brand-blue transition-colors">{topic.name}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{topic.count}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                 <FaArrowLeft className="text-[10px]" />
            </div>
        </div>
    </div>
);

const AlertCard = ({ image, category, title, author, date, delay }) => (
    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-brand-red/30 transition-all duration-300 h-full group" data-aos="fade-up" data-aos-delay={delay}>
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
    </div>
);

export default function TopicsSection() {
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
                <span className="font-bold text-gray-500">مساحة إعلانية</span>
                <span className="text-xs">تواصل معنا</span>
            </div>

        </section>
    );
}
