import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaBolt } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AOS from 'aos';
import 'aos/dist/aos.css';

const SectionLabel = ({ title, colorClass = "bg-black" }) => (
    <div className="mb-6 border-b-2 border-gray-100 flex items-center justify-between">
        <h2 className={`${colorClass} text-white px-4 py-1.5 font-bold text-base relative top-[2px] shadow-sm`}>
            {title}
        </h2>
    </div>
);

const DontMissCard = ({ category, title, author, date, image, delay }) => (
    <div className="flex gap-5 mb-6 group cursor-pointer border-b border-gray-50 last:border-0 pb-6 last:pb-0 hover:bg-gray-50/50 p-2 rounded-lg transition-colors" data-aos="fade-up" data-aos-delay={delay}>
        <div className="w-[160px] h-[110px] shrink-0 overflow-hidden rounded-lg shadow-sm relative">
            <img
                src={image}
                alt={title}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>
        <div className="flex flex-col justify-between py-1">
            <div>
                <Badge className="w-fit bg-blue-600 hover:bg-blue-700 text-white border-0 mb-2 px-2 py-0.5 text-[10px] rounded-sm shadow-sm">
                    {category}
                </Badge>
                <h3 className="font-bold text-[15px] leading-snug text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                    {title}
                </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2 font-medium">
                <span className="text-gray-600">{author.name}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{date}</span>
            </div>
        </div>
    </div>
);

const BreakingNewsCard = () => (
    <div className="relative group cursor-pointer h-full min-h-[450px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300" data-aos="zoom-in">
        <img
            src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=800&auto=format&fit=crop"
            alt="Breaking News"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-black/20 to-transparent opacity-90"></div>

        <div className="absolute bottom-0 left-0 p-8 w-full text-white z-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="bg-red-600/90 backdrop-blur-sm text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg border border-red-500">
                    تحديث مباشر
                </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-red-100 transition-colors drop-shadow-md">
                السلطات تعلن حالة الطوارئ القصوى مع ارتفاع منسوب الفيضانات في العاصمة
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-200 border-t border-white/20 pt-4 font-medium">
                <span className="flex items-center gap-1"><FaBolt className="text-yellow-400"/> منذ 15 دقيقة</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span>المصدر: وكالة الأنباء المركزية</span>
            </div>
        </div>
    </div>
);

const SocialStats = () => (
    <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl mb-8">
        <h3 className="font-bold text-sm text-gray-900 mb-5 text-center uppercase tracking-wider border-b border-gray-50 pb-3">تواصل معنا</h3>
        <div className="flex justify-between px-2">
            {[
                { Icon: FaFacebookF, color: "bg-[#1877F2]", count: "180K", shadow: "shadow-blue-200" },
                { Icon: FaTwitter, color: "bg-black", count: "57K", shadow: "shadow-gray-300" },
                { Icon: FaInstagram, color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500", count: "97K", shadow: "shadow-pink-200" }
            ].map((social, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={`w-12 h-12 rounded-full ${social.color} text-white flex items-center justify-center shadow-lg ${social.shadow} group-hover:scale-110 transition-transform`}>
                        <social.Icon size={20} />
                    </div>
                    <span className="font-bold text-xs text-gray-600">{social.count}</span>
                </div>
            ))}
        </div>
    </div>
);

const JustForYouItem = ({ category, title, image, colorClass }) => (
    <div className="flex gap-4 mb-4 group cursor-pointer border-b border-gray-50 pb-3 last:border-0 last:pb-0 hover:bg-gray-50/50 p-2 rounded-lg transition-colors">
        <div className="w-[70px] h-[70px] shrink-0 overflow-hidden rounded-lg shadow-sm">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="flex flex-col justify-center">
            <span className={`text-[10px] font-bold ${colorClass} mb-1 uppercase tracking-wide`}>{category}</span>
            <h4 className="font-bold text-sm leading-snug text-gray-800 group-hover:text-brand-blue transition-colors line-clamp-2">
                {title}
            </h4>
        </div>
    </div>
);

export default function ContentGridSection() {
    return (
        <section className="container mx-auto px-4 py-16 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-5 flex flex-col">
                    <SectionLabel title="لا تفوت" />
                    <div className="flex flex-col gap-1">
                        <DontMissCard
                            delay="0" category="تكنولوجيا"
                            title="خبراء الأمن السيبراني يحذرون من موجة هجمات فدية جديدة تستهدف الشركات"
                            date="25 يوليو"
                            author={{name: "دانيال براون"}}
                            image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80"
                        />
                        <DontMissCard
                            delay="100" category="صحة"
                            title="دراسة جديدة: معدلات السمنة ترتفع مع زيادة استهلاك الأطعمة المصنعة"
                            date="25 يوليو"
                            author={{name: "جويل ميسنر"}}
                            image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80"
                        />
                        <DontMissCard
                            delay="200" category="بيئة"
                            title="تقرير المناخ: دراسة جديدة تربط تلوث الهواء بارتفاع معدلات الوفيات"
                            date="25 يوليو"
                            author={{name: "مارثا لوسك"}}
                            image="https://images.unsplash.com/photo-1569163139599-0f4517e36b31?auto=format&fit=crop&w=300&q=80"
                        />
                         <DontMissCard
                            delay="300" category="اقتصاد"
                            title="البنوك المركزية تدرس رفع أسعار الفائدة لمواجهة التضخم المتزايد"
                            date="24 يوليو"
                            author={{name: "أحمد علي"}}
                            image="https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=300&q=80"
                        />
                    </div>
                </div>

                <div className="lg:col-span-4 h-full flex flex-col">
                    <SectionLabel title="خبر عاجل" colorClass="bg-red-600" />
                    <div className="flex-1">
                        <BreakingNewsCard />
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col">
                    <SocialStats />

                    <div className="bg-brand-red text-white px-4 py-2 font-bold text-sm mb-5 shadow-md rounded-sm flex items-center justify-between">
                        <span>خصيصاً لك</span>
                        <FaBolt className="text-yellow-400" />
                    </div>

                    <div className="flex flex-col bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                        <JustForYouItem
                            category="عالم" colorClass="text-red-600"
                            title="إحباط مخطط أمني خطير في اللحظات الأخيرة"
                            image="https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=150&q=80"
                        />
                        <JustForYouItem
                            category="سياسة" colorClass="text-purple-600"
                            title="تحولات مفاجئة في نتائج الانتخابات المحلية"
                            image="https://images.unsplash.com/photo-1529101091760-61df6be34fc8?auto=format&fit=crop&w=150&q=80"
                        />
                        <JustForYouItem
                            category="سفر" colorClass="text-teal-600"
                            title="أفضل 5 وجهات سياحية لقضاء عطلة الصيف"
                            image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=150&q=80"
                        />
                        <JustForYouItem
                            category="فنون" colorClass="text-pink-600"
                            title="معرض فني جديد يثير الجدل في الأوساط الثقافية"
                            image="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=150&q=80"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
