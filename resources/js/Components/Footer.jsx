import React from 'react';
import { Link } from '@inertiajs/react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart } from 'react-icons/fa';
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="bg-[#000a2e] text-white pt-12 sm:pt-16 pb-8 font-sans border-t-4 border-brand-red relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12">

                    <div className="lg:col-span-4 flex flex-col items-start">
                        <div className="mb-6">
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

                        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm">
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
                                <a
                                    key={idx}
                                    href="#"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full border border-white/10
                                    flex items-center justify-center text-gray-400 hover:bg-white
                                    hover:text-[#000a2e] hover:border-white transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 pt-2">
                        {[
                            { title: "عن مدقق", links: ["من نحن", "فريق التحرير", "وظائف خالية", "أعلن معنا"] },
                            { title: "الأقسام", links: ["أخبار عاجلة", "سياسة واقتصاد", "تكنولوجيا", "علوم وبيئة", "رياضة"] },
                            { title: "مساعدة", links: ["اتصل بنا", "الأسئلة الشائعة", "سياسة الخصوصية", "الشروط والأحكام"] }
                        ].map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                    {section.title}
                                    <span className="absolute -bottom-2 right-0 w-8 h-1 bg-brand-red rounded-full"></span>
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link href="#" className="hover:text-brand-red hover:translate-x-[-5px] transition-all duration-300 inline-block">
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-white/10 mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 font-medium">
                    <p className="flex items-center gap-1">
                        جميع الحقوق محفوظة © {new Date().getFullYear()}
                        <span className="text-gray-300 font-bold">Mudakik News</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <span>صنع بكل</span>
                        <FaHeart className="text-brand-red mx-1 animate-pulse" />
                        <span>بواسطة فريق مدقق</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
