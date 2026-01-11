import React from 'react';
import { Link } from '@inertiajs/react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart } from 'react-icons/fa';
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="bg-[#000a2e] text-white pt-12 sm:pt-16 pb-8 font-sans border-t-4 border-brand-red relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12">
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <Link href="/" className="flex items-center gap-3 group shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:rotate-6 transition-transform border border-white/10">
                                    <span className="font-black text-2xl text-white pb-1 relative top-[1px]">مـ</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-2xl font-black text-white leading-none tracking-tight">
                                        مدقق <span className="text-brand-red">.</span>
                                    </h1>
                                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] -mt-0.5 mr-0.5">
                                        نيوز
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed text-right">
                            المصدر الأول للأخبار الموثوقة والتحليلات العميقة.
                            نلتزم بالدقة والموضوعية في نقل الأحداث العالمية والمحلية لحظة بلحظة.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FaFacebookF, label: 'Facebook' },
                                { Icon: FaTwitter, label: 'Twitter' },
                                { Icon: FaInstagram, label: 'Instagram' },
                                { Icon: FaLinkedinIn, label: 'LinkedIn' }
                            ].map(({ Icon, label }, idx) => (
                                <a key={idx} href="#" aria-label={label} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-[#000a2e] hover:border-white transition-all duration-300">
                                     <Icon size={16} />
                                </a>
                             ))}
                         </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 pt-2">
                        <div className="text-right">
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                عن مدقق
                                <span className="absolute -bottom-2 right-0 w-8 h-1 bg-brand-red rounded-full"></span>
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-all">من نحن</a></li>
                                <li><a href="#" className="hover:text-white transition-all">فريق التحرير</a></li>
                                <li><a href="#" className="hover:text-white transition-all">وظائف خالية</a></li>
                                <li><a href="#" className="hover:text-white transition-all">أعلن معنا</a></li>
                            </ul>
                        </div>

                        <div className="text-right">
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                الأقسام
                                <span className="absolute -bottom-2 right-0 w-8 h-1 bg-brand-red rounded-full"></span>
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-all">أخبار عاجلة</a></li>
                                <li><a href="#" className="hover:text-white transition-all">سياسة واقتصاد</a></li>
                                <li><a href="#" className="hover:text-white transition-all">تكنولوجيا</a></li>
                                <li><a href="#" className="hover:text-white transition-all">رياضة</a></li>
                            </ul>
                        </div>

                        <div className="text-right">
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                مساعدة
                                <span className="absolute -bottom-2 right-0 w-8 h-1 bg-brand-red rounded-full"></span>
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>
                                    <Link href="/contact" className="hover:text-white hover:translate-x-[-5px] transition-all duration-300 inline-block">اتصل بنا</Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="hover:text-white hover:translate-x-[-5px] transition-all duration-300 inline-block">الأسئلة الشائعة</Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-white hover:translate-x-[-5px] transition-all duration-300 inline-block">سياسة الخصوصية</Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white hover:translate-x-[-5px] transition-all duration-300 inline-block">الشروط والأحكام</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10 mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 font-medium">
                    <p className="flex items-center gap-1">
                        جميع الحقوق محفوظة © 2026
                        <span className="text-gray-300 font-bold">Mudakik News</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <span>صنع بكل</span>
                        <FaHeart className="text-red-600 mx-1" />
                        <span>بواسطة فريق مدقق</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}