import React, { useState, useEffect } from 'react';
import {
    FaBars, FaTimes, FaPenNib, FaChevronDown,
    FaSignOutAlt, FaIdCard, FaUserShield, FaFileAlt,
    FaCreditCard, FaCheckDouble, FaAngleLeft
} from 'react-icons/fa';
import { Link, usePage } from '@inertiajs/react';
import Search from './Search';
import Notifications from './Notifications';
import UserBadge from '@/Components/UserBadge';

const Header = ({ auth, ticker }) => {
    const { url, props } = usePage();
    const user = auth?.user || props.auth?.user;
    const globalTicker = ticker || props.ticker || [];

    const isActive = (itemLink, itemSlug) => {
        if (itemSlug === null && url === '/') return true;
        if (itemSlug === null && url !== '/') return false;
        if (itemSlug === 'plans' && url.startsWith('/plans')) return true;
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const currentCategoryParam = urlParams.get('category');
        if (itemSlug === 'news') {
            return url.startsWith('/posts') && !currentCategoryParam;
        }
        if (currentCategoryParam === itemSlug) {
            return true;
        }
        return false;
    };

    const getPlanSlug = (currentUser) => {
        if (!currentUser) return 'free';

        if (currentUser.subscription?.plan?.slug) {
            return currentUser.subscription.plan.slug.toLowerCase();
        }

        if (currentUser.subscriptions?.length > 0 && currentUser.subscriptions[0]?.plan?.slug) {
            return currentUser.subscriptions[0].plan.slug.toLowerCase();
        }

        if (currentUser.plan_slug) {
            return currentUser.plan_slug.toLowerCase();
        }

        return 'free';
    };

    const userPlanSlug = getPlanSlug(user);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isTickerPaused, setIsTickerPaused] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isJournalist = user?.role === 'journalist';
    const canWrite = (isAdmin || isJournalist) && user?.status !== 'banned';

    const safeRoute = (name, params = undefined) => {
        try { return route(name, params); } catch (e) { return '#'; }
    };

    const mainCategories = [
        { name: 'الرئيسية', link: '/', slug: null },
        { name: 'باقات الاشتراك', link: safeRoute('plans.index'), slug: 'plans' },
        { name: 'أخبار', link: safeRoute('posts.index'), slug: 'news' },
        { name: 'اقتصاد', link: safeRoute('posts.index', { category: 'economy' }), slug: 'economy' },
        { name: 'تكنولوجيا', link: safeRoute('posts.index', { category: 'tech' }), slug: 'tech' },
    ];

    const moreCategories = [
        { name: 'رياضة', link: safeRoute('posts.index', { category: 'sports' }), slug: 'sports' },
        { name: 'صحة', link: safeRoute('posts.index', { category: 'health' }), slug: 'health' },
        { name: 'ثقافة', link: safeRoute('posts.index', { category: 'culture' }), slug: 'culture' },
        { name: 'فنون', link: safeRoute('posts.index', { category: 'arts' }), slug: 'arts' },
        { name: 'ترفية', link: safeRoute('posts.index', { category: 'entertainment' }), slug: 'entertainment' },
        { name: 'علوم', link: safeRoute('posts.index', { category: 'science' }), slug: 'science' },
    ];

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            if (!isMobileMenuOpen) {
                setIsScrolled(window.scrollY > 20);
            }
        };
        window.addEventListener('scroll', handleScroll);

        let interval;
        if (globalTicker.length > 0 && !isTickerPaused) {
            interval = setInterval(() => {
                setCurrentNewsIndex((prev) => (prev + 1) % globalTicker.length);
            }, 5000);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (interval) clearInterval(interval);
        };
    }, [globalTicker.length, isTickerPaused, isMobileMenuOpen]);

    const mobileLinkStyle = `
        flex items-center justify-between px-4 py-3.5 mx-2 rounded-xl
        text-gray-600 font-bold transition-all duration-200
        hover:bg-gray-100 hover:text-brand-red active:scale-[0.98]
    `;

    const userMenuStyle = "flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-all w-full text-right";

    return (
        <header className="w-full flex flex-col font-sans relative">
            <div className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 border-b border-white/5
                ${isScrolled ? 'bg-[#000a2e]/95 backdrop-blur-md shadow-lg py-2 h-[70px]' : 'bg-[#000a2e] py-4 h-[80px]'}`}>

                <div className="container mx-auto flex justify-between items-center px-4 md:px-6 h-full relative z-[60]">

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

                    <nav className={`hidden lg:flex items-center gap-6 text-[14px] font-medium text-gray-300 h-full transition-all duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'}`}>
                        {mainCategories.map((item) => {
                            const active = isActive(item.link, item.slug);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.link}
                                    className={`relative group py-2 transition-colors ${active ? 'text-white font-bold' : 'hover:text-white'}`}
                                >
                                    {item.name}
                                    <span className={`absolute bottom-0 right-0 h-0.5 bg-brand-red transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            );
                        })}

                        <div className="relative group h-full flex items-center cursor-pointer">
                            <span className="flex items-center gap-1 hover:text-white transition-colors py-2">
                                المزيد <FaChevronDown className="text-[10px] mt-1 group-hover:rotate-180 transition-transform" />
                            </span>
                            <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-48 bg-[#000a2e] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                                <div className="p-2 flex flex-col">
                                    {moreCategories.map((subItem) => (
                                        <Link key={subItem.name} href={subItem.link} className={`${userMenuStyle} ${isActive(subItem.link, subItem.slug) ? 'bg-white/10 text-white font-bold' : ''}`}>
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4 relative">
                        {!isSearchActive && (
                            <div className="hidden lg:flex items-center">
                                <Link href="/check" className="flex items-center gap-2 text-white bg-white/5 hover:bg-green-600/20 hover:border-green-500/50 px-3 py-1.5 rounded-full border border-white/10 transition-all duration-300 group shadow-sm">
                                    <FaCheckDouble className="text-green-400 group-hover:text-green-300 transition-colors text-xs" />
                                    <span className="font-bold text-xs group-hover:text-green-100">مختبر الحقيقة</span>
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2 h-8">
                            <Search onToggle={(isOpen) => setIsSearchActive(isOpen)} />
                            <div className={`${isSearchActive ? 'hidden' : 'block'}`}>
                                <Notifications user={user} />
                            </div>
                        </div>

                        <div className={`hidden md:flex items-center gap-2 ${isSearchActive ? 'hidden' : 'flex'}`}>
                            {user ? (
                                <>
                                    {canWrite && (
                                        <Link
                                            href={safeRoute('profile.edit', { tab: 'create_post' })}
                                            className="bg-brand-red hover:bg-red-700 text-white
                                            rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all hover:-translate-y-0.5"
                                        >
                                            <FaPenNib className="text-sm" />
                                        </Link>
                                    )}

                                    <div className="relative group h-full flex items-center cursor-pointer ml-2">
                                        <div className="flex items-center gap-2 text-gray-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full border border-transparent hover:border-white/10 transition-all">
                                            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold max-w-[80px] truncate">{user.name}</span>

                                            <UserBadge user={user} planSlug={userPlanSlug} />

                                            <FaChevronDown className="text-[10px] group-hover:rotate-180 transition-transform" />
                                        </div>

                                        <div className="absolute top-[50px] left-0 w-56 bg-[#000a2e] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                                            <div className="p-4 border-b border-white/10 bg-white/5">
                                                <div className="flex items-center gap-2 mb-1">
                                                     <p className="text-white text-sm font-bold truncate">{user.name}</p>
                                                     <div className="scale-75 origin-right">
                                                        <UserBadge user={user} planSlug={userPlanSlug} />
                                                     </div>
                                                </div>
                                                <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 mt-1 inline-block">
                                                    {isAdmin ? 'مدير النظام' : isJournalist ? 'صحفي' : 'عضو'}
                                                </span>
                                            </div>

                                            <div className="p-2 flex flex-col gap-1">
                                                <Link href={safeRoute('profile.edit')} className={userMenuStyle}>
                                                    <FaIdCard className="text-blue-400" /> الملف الشخصي
                                                </Link>
                                                <Link href={safeRoute('profile.edit', { tab: 'subscription' })} className={userMenuStyle}>
                                                    <FaCreditCard className="text-purple-400" /> اشتراكاتي
                                                </Link>
                                                {(isAdmin || isJournalist) && (
                                                    <Link href={safeRoute('profile.edit', { tab: 'articles' })} className={userMenuStyle}>
                                                        <FaFileAlt className="text-green-400" /> مقالاتي
                                                    </Link>
                                                )}
                                                {isAdmin && (
                                                    <Link href={safeRoute('admin.dashboard')} className={`${userMenuStyle} text-yellow-500 font-bold bg-yellow-500/5 hover:bg-yellow-500/20`}>
                                                        <FaUserShield /> لوحة الأدمن
                                                    </Link>
                                                )}
                                                <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                                                <Link href={safeRoute('logout')} method="post" as="button" className={`${userMenuStyle} text-red-400 hover:text-red-300 hover:bg-red-900/20`}>
                                                    <FaSignOutAlt /> تسجيل خروج
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href={safeRoute('login')} className="text-xs font-bold text-gray-300 hover:text-white px-3">دخول</Link>
                                    <Link href={safeRoute('register')} className="bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-red-700 transition-all">حساب جديد</Link>
                                </>
                            )}
                        </div>

                        <button className={`lg:hidden text-white text-2xl focus:outline-none ml-2 transition-transform duration-300 ${isSearchActive ? 'hidden' : 'block'} ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`
                fixed inset-0 bg-white z-[40] flex flex-col transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto pt-[80px]
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-4">
                    {user ? (
                        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#000a2e] text-white rounded-xl flex items-center justify-center text-lg font-black shadow-md shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                                        <UserBadge user={user} planSlug={userPlanSlug} />
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                <Link href={safeRoute('profile.edit')} onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center text-xs bg-white border border-gray-200 py-2 rounded-lg font-bold text-gray-700 shadow-sm">
                                    الإعدادات
                                </Link>
                                <Link href={safeRoute('profile.edit', { tab: 'subscription' })} onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center text-xs bg-[#000a2e] text-white py-2 rounded-lg font-bold shadow-sm">
                                    اشتراكاتي
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                             <p className="text-gray-500 text-sm font-bold mb-4">انضم لعالم الحقيقة الآن</p>
                            <div className="flex gap-3">
                                <Link href={safeRoute('login')} onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm">
                                    دخول
                                </Link>
                                <Link href={safeRoute('register')} onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 py-2.5 bg-brand-red text-white rounded-xl font-bold shadow-red-200 shadow-lg">
                                    حساب جديد
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 px-2 pb-8">
                     <div className="px-2 mb-6">
                        <Link href="/check" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-3 rounded-xl group active:scale-[0.98] transition-transform">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <FaCheckDouble className="text-xs" />
                                </div>
                                <span className="font-bold text-gray-800">مختبر الحقيقة</span>
                            </div>
                            <FaAngleLeft className="text-green-500 text-sm" />
                        </Link>
                    </div>

                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">الأقسام الرئيسية</p>
                    {mainCategories.map((item) => (
                        <Link key={item.name} href={item.link} onClick={() => setIsMobileMenuOpen(false)}
                            className={`${mobileLinkStyle} ${isActive(item.link, item.slug) ? 'bg-red-50 text-brand-red border border-red-100/50' : ''}`}>
                            <span>{item.name}</span>
                            {isActive(item.link, item.slug) && <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>}
                        </Link>
                    ))}

                    <div className="my-4 h-px bg-gray-100 mx-4"></div>

                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">المزيد</p>
                    <div className="grid grid-cols-2 gap-2 px-2">
                        {moreCategories.map((item) => (
                            <Link key={item.name} href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-colors ${isActive(item.link, item.slug) ? 'bg-brand-red text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                 {user && (
                    <div className="p-4 bg-white border-t border-gray-100">
                        <Link href={safeRoute('logout')} method="post" as="button"
                            className="w-full flex items-center justify-center gap-2
                        text-red-600 font-bold py-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <FaSignOutAlt /> تسجيل خروج
                        </Link>
                    </div>
                )}
            </div>

            <div
                className="mt-[80px] bg-gradient-to-r from-[#8a0008] via-[#b20e1e]
                to-[#8a0008] text-white h-10 flex items-center relative
                z-30 overflow-hidden shadow-inner border-t border-red-900/50"
                onMouseEnter={() => setIsTickerPaused(true)}
                onMouseLeave={() => setIsTickerPaused(false)}
            >
                <div className="container mx-auto flex justify-between items-center px-4 h-full relative">
                    <div className="absolute right-0 h-full z-20 flex items-center pr-4
                    pl-8 bg-gradient-to-l from-[#8a0008] via-[#b20e1e] to-transparent">
                        <div className="bg-white text-[#b20e1e] font-black text-[10px]
                          md:text-xs uppercase px-3 py-1 transform skew-x-[-10deg] shadow-md
                          tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full
                             animate-pulse block transform skew-x-[10deg]"></span>
                            <span className="transform skew-x-[10deg]">عاجل</span>
                        </div>
                    </div>
                    <div className="flex-1 h-full flex items-center mr-32 overflow-hidden relative">
                        <div className="w-full">
                            {globalTicker.length > 0 ? (
                                <Link
                                    key={currentNewsIndex}
                                    href={safeRoute('posts.show', globalTicker[currentNewsIndex]?.slug)}
                                    className="text-xs md:text-sm font-medium text-white
                                    hover:text-yellow-300 transition-colors block truncate"
                                >
                                    {globalTicker[currentNewsIndex]?.title}
                                </Link>
                            ) : (
                                <p className="text-xs md:text-sm font-medium
                                text-white/80 animate-pulse">أهلاً بك في مدقق نيوز - المصدر الأول للحقيقة</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
