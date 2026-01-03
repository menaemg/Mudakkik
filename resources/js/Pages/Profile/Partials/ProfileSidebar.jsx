import React from 'react';
import { Link } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FaChartLine, FaPenNib, FaHeart, FaCog, FaBullhorn, FaSignOutAlt, FaLock, FaCreditCard } from 'react-icons/fa';

const SidebarItem = ({ icon: Icon, label, active, locked, onClick, isDanger }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 mb-2 group select-none
        ${active ? 'bg-[#000a2e] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}
        ${isDanger ? 'hover:bg-red-50 hover:text-red-600' : ''}`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`${active ? 'text-brand-red' : 'text-gray-400 group-hover:text-current'} transition-colors`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
        {locked && <FaLock className="text-gray-300 text-xs" />}
    </div>
);

export default function ProfileSidebar({ user, stats, activeTab, setActiveTab, canManageAds }) {
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

                <h2 className="font-black text-lg text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-500 mb-4 font-medium" dir="ltr">{user.email}</p>

                <div className="flex justify-center gap-2 mb-4">
                    <Badge className="bg-blue-50 text-brand-blue hover:bg-blue-100 border-0 shadow-none px-3 py-1">{stats.role}</Badge>
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-500 px-3 py-1">{stats.plan}</Badge>
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
                <SidebarItem icon={FaPenNib} label="مقالاتي" active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
                <SidebarItem icon={FaCreditCard} label="اشتراكاتي" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
                <SidebarItem icon={FaHeart} label="المفضلة" active={activeTab === 'likes'} onClick={() => setActiveTab('likes')} />
                <SidebarItem icon={FaCog} label="الإعدادات" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

                <div className="my-2 border-t border-gray-100"></div>

                <SidebarItem
                    icon={FaBullhorn}
                    label="إدارة الإعلانات"
                    active={activeTab === 'ads'}
                    onClick={() => setActiveTab('ads')}
                    locked={!canManageAds}
                />

                <Link href={route('logout')} method="post" as="div">
                    <SidebarItem icon={FaSignOutAlt} label="تسجيل الخروج" isDanger />
                </Link>
            </div>
        </div>
    );
}
