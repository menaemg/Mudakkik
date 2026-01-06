import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    FaChartLine, FaPenNib, FaHeart, FaCog, FaBullhorn,
    FaSignOutAlt, FaLock, FaCreditCard, FaRobot, FaAd
} from 'react-icons/fa';
import UserBadge from '@/Components/UserBadge';

const SidebarItem = ({ icon: Icon, label, active, locked, onClick, isDanger, badge }) => (
    <div
        onClick={locked ? undefined : onClick}
        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 mb-2 group select-none
        ${active ? 'bg-[#000a2e] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}
        ${isDanger ? 'hover:bg-red-50 hover:text-red-600' : ''}
        ${locked ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`${active ? 'text-brand-red' : 'text-gray-400 group-hover:text-current'} transition-colors`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {badge && <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}
            {locked && <FaLock className="text-gray-400 text-xs" />}
        </div>
    </div>
);

export default function ProfileSidebar({ stats, activeTab, setActiveTab, current_plan }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const aiCredits = stats?.ai_credits || 0;
    const adCredits = stats?.ad_credits || 0;

    const canAccessArticles = user.role === 'journalist' || user.role === 'admin';
    const isFreePlan = current_plan?.is_free || current_plan?.slug === 'free';
      // console.log('Current Plan:', current_plan);
      // console.log('Stats Plan:', stats?.plan);
      // console.log('Is Free Plan Logic:', isFreePlan);
    return (

        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#000a2e] to-blue-900 transition-all duration-500 group-hover:h-28"></div>

                <div className="relative z-10 -mt-2 mb-3">
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md relative bg-white">
                        <Avatar className="w-full h-full">
                            <AvatarImage src={user.avatar ? `/storage/${user.avatar}` : ''} />
                            <AvatarFallback className="text-2xl font-black bg-gray-100 text-[#000a2e]">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-1">
                    <h2 className="font-black text-lg text-gray-900">{user.name}</h2>
                    <UserBadge user={user} planSlug={current_plan?.slug} />
                </div>

                <p className="text-xs text-gray-500 mb-4 font-medium" dir="ltr">{user.email}</p>

                <div className="flex justify-center gap-2 mb-6">
                    <Badge className="bg-blue-50 text-brand-blue hover:bg-blue-100 border-0 shadow-none px-3 py-1">
                        {user.role === 'journalist' ? 'صحفي' : user.role === 'admin' ? 'مدير' : 'عضو'}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border-gray-200 px-3 py-1 ${isFreePlan ? 'text-gray-500' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                        {isFreePlan ? 'باقة مجانية' : (current_plan?.name || stats.plan)}
                    </Badge>
                </div>

                <div className="space-y-4 mb-4 text-right bg-gray-50/50 p-4 rounded-xl border border-gray-100">

                    <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                            <span className="flex items-center gap-1"><FaRobot className="text-indigo-500" /> كاشف الحقائق</span>
                            <span className="text-indigo-600">{aiCredits} نقطة</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(aiCredits, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                            <span className="flex items-center gap-1"><FaAd className="text-green-500" /> رصيد الإعلانات</span>
                            <span className="text-green-600">{adCredits} يوم</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((adCredits / 30) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-center gap-4 border-t border-gray-100 pt-4">
                    <div className="text-center">
                        <span className="block font-bold text-gray-900 text-lg">{stats.followers}</span>
                        <span className="text-[10px] text-gray-400 font-bold">متابع</span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100"></div>
                    <div className="text-center">
                        <span className="block font-bold text-gray-900 text-lg">{stats.following}</span>
                        <span className="text-[10px] text-gray-400 font-bold">أتابع</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <SidebarItem icon={FaChartLine} label="نظرة عامة" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />

                <SidebarItem
                    icon={FaPenNib}
                    label="مقالاتي"
                    active={activeTab === 'articles'}
                    onClick={() => setActiveTab('articles')}
                    locked={!canAccessArticles}
                />

                <SidebarItem icon={FaCreditCard} label="اشتراكاتي" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
                <SidebarItem icon={FaHeart} label="المفضلة" active={activeTab === 'likes'} onClick={() => setActiveTab('likes')} />
                <SidebarItem icon={FaCog} label="الإعدادات" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                <div className="my-2 border-t border-gray-100"></div>

                <SidebarItem
                    icon={FaBullhorn}
                    label="إدارة الإعلانات"
                    active={activeTab === 'ads'}
                    onClick={() => isFreePlan ? null : setActiveTab('ads')}
                    locked={isFreePlan}
                />

                <Link href={route('logout')} method="post" as="div">
                    <SidebarItem icon={FaSignOutAlt} label="تسجيل الخروج" isDanger />
                </Link>
            </div>

            {isFreePlan && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white text-center shadow-lg animate-in slide-in-from-bottom-5">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <FaLock className="text-white" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">افتح جميع المميزات</h3>
                    <p className="text-[10px] text-white/80 mb-3 leading-relaxed">
                        رقي حسابك الآن لفتح ميزة الإعلانات والحصول على رصيد ذكاء اصطناعي مضاعف.
                    </p>
                    <Link href={route('plans.index')} className="block w-full py-2 bg-white text-indigo-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                        ترقية الآن
                    </Link>
                </div>
            )}
        </div>
    );
}
