import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { FaPenNib, FaEye, FaHeart, FaCrown } from 'react-icons/fa';
import StatCard from '../StatCard';
import ArticleListItem from '../ArticleListItem';

export default function OverviewTab({ stats, recentPosts, setActiveTab, setPostToEdit }) {
    // console.log('Current Plan:', stats.plan);

    return (
  <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#000a2e]">لوحة التحكم</h1>
                    <p className="text-gray-400 text-sm mt-1 font-medium">أهلاً بك مجدداً في مساحتك الإبداعية 👋</p>
                </div>

                <Button
                    onClick={() => setActiveTab('create_post')}
                    className="bg-brand-red hover:bg-red-700 text-white shadow-lg gap-2 w-full md:w-auto h-11 px-6 text-base font-bold transition-transform hover:scale-105"
                >
                    <FaPenNib /> كتابة مقال جديد
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={FaEye} label="تفاعل الجمهور" value={stats.views} trend="+0% هذا الأسبوع" />
                <StatCard icon={FaPenNib} label="المقالات المنشورة" value={stats.posts_count} colorClass="bg-purple-50 text-purple-600" />
                <StatCard icon={FaHeart} label="إجمالي المتابعين" value={stats.followers} colorClass="bg-pink-50 text-pink-600" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">آخر الأنشطة</h3>
                    <Button variant="ghost" className="text-xs h-8 text-gray-500 hover:text-brand-blue" onClick={() => setActiveTab('articles')}>
                        عرض الكل
                    </Button>
                </div>

                <div className="flex flex-col">
                    {recentPosts && recentPosts.data && recentPosts.data.length > 0 ? (
                        recentPosts.data.map((post) => (
                            <ArticleListItem
                            key={post.id}
                            post={post}
                            minimal={true}
                            setActiveTab={setActiveTab}
                            setPostToEdit={setPostToEdit}
                            />
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <FaPenNib className="text-2xl text-gray-300" />
                            </div>
                            <p className="font-medium">لم تقم بنشر أي مقالات بعد</p>
                            <Button
                                variant="link"
                                onClick={() => setActiveTab('create_post')}
                                className="text-brand-blue mt-1 font-bold"
                            >
                                ابدأ الكتابة الآن
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {(stats.plan === 'Free' || stats.plan === 'مجاني') && (
                <div className="bg-gradient-to-br from-[#000a2e] to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                                <FaCrown className="text-yellow-400" />
                                انطلق بمسيرتك الصحفية
                            </h3>
                            <p className="text-white/80 text-sm max-w-lg leading-relaxed font-medium">
                                احصل على شارة التوثيق، تحليلات متقدمة، وأولوية في النشر عند الترقية للباقة الاحترافية.
                            </p>
                        </div>
                        <Link href={route('plans.index')}>
                            <Button className="bg-white text-[#000a2e] hover:bg-gray-100 font-bold px-8 shadow-xl border-0 h-11">
                                ترقية الحساب
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            )}
        </div>
    );
}
