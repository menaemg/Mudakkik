import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FaLock } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import ProfileSidebar from './Partials/ProfileSidebar';
import OverviewTab from './Partials/Tabs/OverviewTab';
import ArticlesTab from './Partials/Tabs/ArticlesTab';
import LikesTab from './Partials/Tabs/LikesTab';
import SettingsTab from './Partials/Tabs/SettingsTab';
import AdsTab from './Partials/Tabs/AdsTab';
import CreatePostTab from './Partials/Tabs/CreatePostTab';
import EditPostTab from './Partials/Tabs/EditPostTab';
import SubscriptionTab from './Partials/Tabs/SubscriptionTab';
import CreateAdTab from './Partials/Tabs/CreateAdTab';
import ViewAdTab from './Partials/Tabs/ViewAdTab';
import EditAdTab from './Partials/Tabs/EditAdTab';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Edit({
    mustVerifyEmail,
    status,
    stats,
    recent_posts,
    recent_likes,
    articles,
    liked_posts,
    ad_requests,
    upgrade_request_status,
    categories,
    subscription,
    current_plan,
    ticker,
}) {
    const { auth } = usePage().props;

    const getUrlParams = () => {
        if (typeof window === 'undefined') return { tab: 'overview', postId: null, adId: null };
        const urlParams = new URLSearchParams(window.location.search);
        return {
            tab: urlParams.get('tab') || 'overview',
            postId: urlParams.get('post_id'),
            adId: urlParams.get('ad_id'),
        };
    };

    const [activeTab, setActiveTab] = useState(() => getUrlParams().tab);
    
    const findPostById = (id) => id ? (articles?.data?.find(p => p.id == id) || null) : null;
    const findAdById = (id) => id ? (ad_requests?.data?.find(ad => ad.id == id) || null) : null;

    const [postToEdit, setPostToEdit] = useState(() => findPostById(getUrlParams().postId));
    const [adToEdit, setAdToEdit] = useState(() => findAdById(getUrlParams().adId));

    useEffect(() => {
        const url = new URL(window.location);
        
        if (activeTab === 'overview') {
            url.searchParams.delete('tab');
        } else {
            url.searchParams.set('tab', activeTab);
        }

        if (activeTab === 'edit_post' && postToEdit) {
            url.searchParams.set('post_id', postToEdit.id);
        } else if (url.searchParams.has('post_id') && activeTab !== 'edit_post') {
            url.searchParams.delete('post_id');
        }

        if ((activeTab === 'edit_ad' || activeTab === 'view_ad') && adToEdit) {
            url.searchParams.set('ad_id', adToEdit.id);
        } else if (url.searchParams.has('ad_id') && activeTab !== 'edit_ad' && activeTab !== 'view_ad') {
            url.searchParams.delete('ad_id');
        }

        if (url.href !== window.location.href) {
            window.history.replaceState({}, '', url.href);
        }
    }, [activeTab, postToEdit, adToEdit]);

    useEffect(() => {
        const handlePopState = (event) => {
            const { tab, postId, adId } = getUrlParams();
            setActiveTab(tab);
            setPostToEdit(findPostById(postId));
            setAdToEdit(findAdById(adId));
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const appendTabToPaginationLinks = (paginationData, tabName) => {
        if (!paginationData || !paginationData.links) return paginationData;
        const newLinks = paginationData.links.map(link => {
            if (link.url) {
                const url = new URL(link.url);
                url.searchParams.set('tab', tabName);
                return { ...link, url: url.toString() };
            }
            return link;
        });
        return { ...paginationData, links: newLinks };
    };

    const articlesWithTab = useMemo(() => appendTabToPaginationLinks(articles, 'articles'), [articles]);
    const likesWithTab = useMemo(() => appendTabToPaginationLinks(liked_posts, 'likes'), [liked_posts]);
    const adsWithTab = useMemo(() => appendTabToPaginationLinks(ad_requests, 'ads'), [ad_requests]);

    const dashboardStats = stats || {
        role: "عضو",
        plan: "Free",
        followers: 0,
        following: 0,
        views: 0,
        posts_count: 0
    };

    const canManageAds = current_plan && !current_plan.is_free && current_plan.slug !== 'free';

    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F8] font-sans selection:bg-brand-red selection:text-white" dir="rtl">
            <Head title="لوحة التحكم | مدقق نيوز" />

            <Header auth={auth} ticker={ticker} />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <main className="flex-grow pt-32 pb-20 relative z-10">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        <div className="lg:col-span-3 lg:sticky lg:top-28 transition-all duration-300 self-start">
                            <ProfileSidebar
                                stats={dashboardStats}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                canManageAds={canManageAds}
                                current_plan={current_plan}
                            />
                        </div>

                        <div className="lg:col-span-9 min-w-0 h-full flex flex-col">
                            <div className="transition-all duration-500 ease-in-out flex-grow flex flex-col">
                                {activeTab === 'ads' && (
                                    canManageAds ? (
                                        <AdsTab
                                            adRequests={adsWithTab}
                                            remainingDays={stats.ad_credits}
                                            setActiveTab={setActiveTab}
                                            setAdToEdit={setAdToEdit}
                                        />
                                    ) : (
                                        <div className="bg-white p-16 rounded-[2.5rem] text-center border border-white shadow-xl shadow-blue-900/5 flex flex-col items-center justify-center relative overflow-hidden group flex-grow">
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                <FaLock className="text-5xl text-gray-300 group-hover:text-brand-red transition-colors" />
                                            </div>
                                            <h3 className="font-black text-3xl text-[#020617] mb-3 tracking-tighter">ميزة حصرية للمشتركين</h3>
                                            <p className="text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium text-lg">
                                                إدارة الحملات الإعلانية متاحة فقط لأصحاب الباقات المدفوعة. قم بترقية حسابك الآن للوصول إلى هذه الميزة والمزيد.
                                            </p>
                                            <Link href={route('plans.index')}>
                                                <button className="bg-[#020617] hover:bg-brand-red text-white font-black py-5 px-12 rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 text-lg">
                                                    استكشف باقات الترقية
                                                </button>
                                            </Link>
                                        </div>
                                    )
                                )}

                                {activeTab === 'create_ad' && (
                                    <CreateAdTab
                                        remainingDays={stats.ad_credits}
                                        setActiveTab={setActiveTab}
                                    />
                                )}
                                {activeTab === 'view_ad' && adToEdit && (
                                    <ViewAdTab ad={adToEdit} setActiveTab={setActiveTab} />
                                )}

                                {activeTab === 'edit_ad' && adToEdit && (
                                    <EditAdTab
                                        ad={adToEdit}
                                        remainingDays={stats.ad_credits}
                                        setActiveTab={setActiveTab}
                                    />
                                )}
                                {activeTab === 'subscription' && (
                                    <SubscriptionTab
                                        subscription={subscription}
                                        plan={current_plan}
                                    />
                                )}

                                {activeTab === 'create_post' && (
                                    <CreatePostTab categories={categories} setActiveTab={setActiveTab} />
                                )}

                                {activeTab === 'edit_post' && postToEdit && (
                                    <EditPostTab
                                        post={postToEdit}
                                        categories={categories}
                                        setActiveTab={setActiveTab}
                                    />
                                )}

                                {activeTab === 'overview' && (
                                    <OverviewTab
                                        stats={dashboardStats}
                                        recentPosts={recent_posts}
                                        setActiveTab={setActiveTab}
                                        setPostToEdit={setPostToEdit}
                                        current_plan={current_plan}
                                        recentLikes={recent_likes}
                                        upgradeRequestStatus={upgrade_request_status}
                                    />
                                )}

                                {activeTab === 'articles' && (
                                    <ArticlesTab
                                        articles={articlesWithTab}
                                        setActiveTab={setActiveTab}
                                        setPostToEdit={setPostToEdit}
                                    />
                                )}

                                {activeTab === 'likes' && (
                                    <LikesTab likedPosts={likesWithTab} />
                                )}

                                {activeTab === 'settings' && (
                                    <SettingsTab
                                        stats={dashboardStats}
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                    />
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
