import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    FaChartLine, FaPenNib, FaHeart, FaCog, FaBullhorn,
    FaSignOutAlt, FaLock, FaCreditCard, FaRobot, FaAd, FaCrown
} from 'react-icons/fa';
import UserBadge from '@/Components/UserBadge';

const SidebarItem = ({ icon: Icon, label, active, locked, onClick, isDanger, badge }) => (
    <div
        onClick={locked ? undefined : onClick}
        className={`relative flex items-center justify-between p-3.5 mx-2 rounded-xl cursor-pointer transition-all duration-300 group select-none overflow-hidden
        ${active
            ? 'bg-gradient-to-r from-[#000a2e] to-[#0a1545] text-white shadow-lg shadow-blue-900/20 translate-x-1'
            : 'text-gray-600 hover:bg-gray-50 hover:text-[#000a2e]'}
        ${isDanger ? 'hover:bg-red-50 hover:text-red-600 mt-4 border-t border-gray-50 pt-4' : ''}
        ${locked ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
    >
        {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-red rounded-l-full shadow-[0_0_10px_#ef4444]"></div>}

        <div className="flex items-center gap-4 relative z-10">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${active ? 'bg-white/10 text-white' : 'bg-gray-100/50 text-gray-400 group-hover:bg-white group-hover:text-current group-hover:shadow-sm'}`}>
                <Icon size={16} />
            </div>
            <span className={`font-bold text-sm ${active ? 'tracking-wide' : ''}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2 relative z-10">
            {badge && <span className="bg-brand-red text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm shadow-red-500/20">{badge}</span>}
            {locked && <FaLock className="text-gray-400/50 text-xs" />}
        </div>
    </div>
);

export default function ProfileSidebar({ stats, activeTab, setActiveTab, current_plan }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const aiCredits = stats?.ai_credits || 0;
    const adCredits = stats?.ad_credits || 0;

    const verificationBadgeLevel = current_plan?.features?.verification_badge || null;

    const canAccessArticles = user.role === 'journalist' || user.role === 'admin';
    const isFreePlan = current_plan?.is_free || current_plan?.slug === 'free';
    return (
        <div className="flex flex-col gap-6 sticky top-28 transition-all duration-500">

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-36 bg-[#000a2e] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#000a2e] via-[#0f172a] to-[#020617]"></div>
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-red/10 rounded-full blur-[60px] group-hover:bg-brand-red/20 transition-all duration-1000"></div>
                    <div className="absolute -left-12 bottom-0 w-40 h-40 bg-blue-600/10 rounded-full blur-[60px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="relative z-10 pt-20 px-6 pb-8 text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-28 h-28 p-1.5 rounded-full bg-white shadow-2xl relative z-10 mx-auto">
                            <Avatar className="w-full h-full border-4 border-gray-50 bg-gray-100">
                                <AvatarImage src={user.avatar ? `/storage/${user.avatar}?t=${new Date().getTime()}` : ''} className="object-cover" />
                                <AvatarFallback className="text-3xl font-black bg-white text-[#000a2e]">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex justify-center w-max">
                             <UserBadge user={user} verificationBadgeLevel={verificationBadgeLevel} className="scale-110 drop-shadow-lg" />
                        </div>
                    </div>

                    <div className="mb-6 pt-2">
                        <h2 className="font-black text-xl text-gray-900 tracking-tight mb-1">{user.name}</h2>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase opacity-80 font-mono" dir="ltr">{user.email}</p>
                    </div>

                    <div className="flex justify-center gap-3 mb-8">
                        <Badge className="bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100 shadow-sm px-4 py-1.5 rounded-xl transition-colors">
                            {user.role === 'journalist' ? 'صحفي' : user.role === 'admin' ? 'مدير' : 'عضو'}
                        </Badge>
                        {!isFreePlan && (
                            <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50/50 px-4 py-1.5 rounded-xl font-bold shadow-sm">
                                <span className="flex items-center gap-1.5"><FaCrown size={10} className="mb-0.5 text-amber-500" /> {current_plan?.name || stats.plan}</span>
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 mb-8 shadow-inner">
                        <div className="bg-gray-50/50 p-4 hover:bg-white transition-colors cursor-help group/stat">
                            <span className="block font-black text-gray-900 text-xl group-hover/stat:text-brand-blue transition-colors">{stats.followers}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">متابع</span>
                        </div>
                        <div className="bg-gray-50/50 p-4 hover:bg-white transition-colors cursor-help group/stat">
                            <span className="block font-black text-gray-900 text-xl group-hover/stat:text-brand-blue transition-colors">{stats.following}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">أتابع</span>
                        </div>
                    </div>

                    <div className="space-y-5 text-right">
                        <div className="group/progress">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2">
                                <span className="flex items-center gap-2"><FaRobot className="text-indigo-500" /> كاشف الحقائق</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{aiCredits} نقطة</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                                    style={{ width: `${Math.min(aiCredits, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="group/progress">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2">
                                <span className="flex items-center gap-2"><FaAd className="text-emerald-500" /> رصيد الإعلانات</span>
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{adCredits} يوم</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    style={{ width: `${Math.min((adCredits / 30) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-4 px-2 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white">
                <SidebarItem icon={FaChartLine} label="نظرة عامة" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />

                <SidebarItem
                    icon={FaPenNib}
                    label="مقالاتي"
                    active={activeTab === 'articles'}
                    onClick={() => setActiveTab('articles')}
                    locked={!canAccessArticles}
                    badge={!canAccessArticles ? null : stats.posts_count}
                />

                <SidebarItem icon={FaCreditCard} label="اشتراكاتي" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
                <SidebarItem icon={FaHeart} label="المفضلة" active={activeTab === 'likes'} onClick={() => setActiveTab('likes')} />
                <SidebarItem icon={FaCog} label="الإعدادات" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                <div className="my-3 border-t border-gray-50 mx-4"></div>

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
                <div
                    className="relative overflow-hidden bg-[#020617] rounded-[2.5rem] p-8 text-center shadow-2xl shadow-blue-900/20 group cursor-pointer border border-white/10 hover:-translate-y-1 transition-all duration-300"
                    onClick={() => window.location.href = route('plans.index')}
                >
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px] group-hover:bg-purple-600/30 transition-all duration-700"></div>
                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px] group-hover:bg-blue-600/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FaLock className="text-white/70 text-xl" />
                        </div>
                        <h3 className="font-black text-lg text-white mb-2 tracking-tight">أطلق العنان لقوتك</h3>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed font-medium px-2">
                            رقي حسابك واحصل على أدوات النشر المتقدمة وتحليلات الذكاء الاصطناعي.
                        </p>
                        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all">
                            ترقية الآن ⚡
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
