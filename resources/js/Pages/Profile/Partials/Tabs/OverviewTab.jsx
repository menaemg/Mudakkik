import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaPenNib, FaEye, FaHeart, FaCrown, FaUserTie, FaRegHeart, FaClock, FaCheckCircle, FaChartPie, FaArrowLeft } from 'react-icons/fa';
import StatCard from '../StatCard';
import ArticleListItem from '../ArticleListItem';
import JoinJournalistModal from '@/Components/JoinJournalistModal';

export default function OverviewTab({ stats, recentPosts, recentLikes, setActiveTab, setPostToEdit, upgradeRequestStatus }) {

    const activityData = stats.is_journalist ? recentPosts?.data : recentLikes?.data;
    const isJournalist = stats.is_journalist;
    const isAdmin = stats.role === 'مدير' || stats.role === 'admin';
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 flex flex-col min-h-[calc(100vh-16rem)] h-full">

            <JoinJournalistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="relative bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-1 overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-purple-500 to-brand-blue"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-center p-8 gap-6">
                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-black text-[#000a2e] tracking-tight">لوحة التحكم</h1>
                        <p className="text-gray-500 font-medium">أهلاً بك مجدداً في مساحتك الإبداعية 👋، إليك نظرة سريعة على أدائك.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {isJournalist ? (
                            <Button
                                onClick={() => setActiveTab('create_post')}
                                className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-red-500/30 gap-2 h-12 px-8 text-base font-bold rounded-xl transition-all hover:-translate-y-1 w-full md:w-auto"
                            >
                                <FaPenNib /> كتابة مقال جديد
                            </Button>
                        ) : isAdmin ? (
                            <Link href={route('admin.dashboard')} className="w-full md:w-auto">
                                 <Button className="bg-[#000a2e] text-white hover:bg-blue-900 shadow-lg h-12 px-8 rounded-xl font-bold w-full">
                                    لوحة الإدارة
                                 </Button>
                            </Link>
                        ) : (
                            <div className="w-full md:w-auto">
                                {upgradeRequestStatus === 'pending' ? (
                                    <div className="bg-amber-50 text-amber-700 border border-amber-200 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm animate-pulse">
                                        <FaClock /> طلبك قيد المراجعة
                                    </div>
                                ) : upgradeRequestStatus === 'approved' ? (
                                     <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm">
                                        <FaCheckCircle /> تمت الموافقة (حدث الصفحة)
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-gradient-to-r from-[#000a2e] to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white shadow-xl shadow-blue-900/20 gap-2 h-12 px-8 text-sm font-bold rounded-xl transition-all hover:-translate-y-1 w-full"
                                    >
                                        <FaUserTie /> انضم لمجتمع الصحفيين
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <StatCard
                    icon={FaEye}
                    label="تفاعل الجمهور"
                    value={stats.views}
                    trend="+0% هذا الأسبوع"
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={FaPenNib}
                    label="المقالات المنشورة"
                    value={stats.posts_count}
                    colorClass="bg-purple-50 text-purple-600"
                />
                <StatCard
                    icon={FaHeart}
                    label="إجمالي المتابعين"
                    value={stats.followers}
                    colorClass="bg-pink-50 text-pink-600"
                />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px] flex-grow h-full">
                <div className="flex items-center justify-between p-8 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            {isJournalist ? <FaChartPie /> : <FaRegHeart />}
                        </div>
                        <h3 className="font-black text-xl text-gray-900">
                            {isJournalist ? 'أحدث مقالاتك' : 'نشاطك الأخير'}
                        </h3>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab(isJournalist ? 'articles' : 'likes')}
                        className="text-sm font-bold text-gray-500 hover:text-brand-blue hover:bg-blue-50 rounded-xl px-4"
                    >
                        عرض الكل <FaArrowLeft className="mr-2 text-xs" />
                    </Button>
                </div>

                <div className="flex-1 w-full flex flex-col">
                    {activityData && activityData.length > 0 ? (
                        <div className="divide-y divide-gray-50 w-full flex-grow">
                            {activityData.map((post) => (
                                <div key={post.id} className="hover:bg-[#f8fafc] transition-colors duration-300">
                                    <ArticleListItem
                                        post={post}
                                        minimal={true}
                                        isLikedView={!isJournalist}
                                        setActiveTab={setActiveTab}
                                        setPostToEdit={setPostToEdit}
                                    />
                                </div>
                            ))}
                             {activityData.length < 3 && (
                                <div className="bg-gray-50/10 flex-grow"></div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-center p-12 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                {isJournalist ? (
                                    <FaPenNib className="text-3xl text-gray-300" />
                                ) : (
                                    <FaRegHeart className="text-3xl text-gray-300" />
                                )}
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-1">لا يوجد نشاط حديث</h4>
                            <p className="font-medium text-sm mb-6 max-w-xs mx-auto">
                                {isJournalist ? 'لم تقم بنشر أي مقالات بعد. ابدأ رحلتك الآن.' : 'لم تقم بالإعجاب بأي مقال بعد. تصفح المحتوى وتفاعل معه.'}
                            </p>
                             {isJournalist ? (
                                <Button onClick={() => setActiveTab('create_post')} className="bg-brand-blue text-white shadow-lg rounded-xl font-bold">
                                    ابدأ الكتابة الآن
                                </Button>
                            ) : (
                                <Link href={route('posts.index')}>
                                    <Button variant="outline" className="border-brand-blue text-brand-blue font-bold rounded-xl">تصفح المقالات</Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

             {(!isAdmin && (stats.plan === 'Free' || stats.plan === 'مجاني')) && (
               <div className="relative overflow-hidden bg-[#020617] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/20 border border-white/10 group cursor-pointer shrink-0" onClick={() => window.location.href = route('plans.index')}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] group-hover:bg-brand-blue/30 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-600/30 transition-all duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-400 text-xs font-bold mb-4 backdrop-blur-md">
                                <FaCrown />
                                <span>عضوية النخبة</span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                                انطلق بمسيرتك الصحفية
                            </h3>
                            <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-medium">
                                احصل على شارة التوثيق، تحليلات متقدمة لجمهورك، وأولوية قصوى في نشر مقالاتك عند الترقية للباقة الاحترافية.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <Button className="bg-white text-[#020617] hover:bg-gray-100 font-black px-8 py-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 text-base">
                                ترقية الحساب الآن
                            </Button>
                        </div>
                    </div>
               </div>
            )}
        </div>
    );
}
