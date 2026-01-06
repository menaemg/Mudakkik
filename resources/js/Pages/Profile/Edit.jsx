import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { FaLock } from 'react-icons/fa';
import ProfileSidebar from './Partials/ProfileSidebar';
import OverviewTab from './Partials/Tabs/OverviewTab';
import ArticlesTab from './Partials/Tabs/ArticlesTab';
import LikesTab from './Partials/Tabs/LikesTab';
import SettingsTab from './Partials/Tabs/SettingsTab';
import AdsTab from './Partials/Tabs/AdsTab';
import CreatePostTab from './Partials/Tabs/CreatePostTab';
import EditPostTab from './Partials/Tabs/EditPostTab';
import SubscriptionTab from './Partials/Tabs/SubscriptionTab';
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

  const getTabFromUrl = () => {
    if (typeof window === 'undefined') return 'overview';
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tab') || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  useEffect(() => {
    let timeoutId = null;
    const handlePopState = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newTab = getTabFromUrl();
        setActiveTab(prevTab => prevTab !== newTab ? newTab : prevTab);
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (activeTab === getTabFromUrl()) return;
    const url = new URL(window.location);
    if (activeTab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const dashboardStats = stats || {
    role: "عضو",
    plan: "Free",
    followers: 0,
    following: 0,
    views: 0,
    posts_count: 0
  };

  const canManageAds = current_plan && !current_plan.is_free && current_plan.slug !== 'free';
  const [postToEdit, setPostToEdit] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA] font-sans" dir="rtl">
      <Head title="لوحة التحكم | مدقق نيوز" />

      <Header auth={auth} ticker={ticker} />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-3">
              <ProfileSidebar
                stats={dashboardStats}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                canManageAds={canManageAds}
                current_plan={current_plan}
              />
            </div>

            <div className="lg:col-span-9 min-w-0">
              {activeTab === 'ads' && (
                canManageAds ? (
                  <AdsTab adRequests={ad_requests} remainingDays={stats.ad_credits} />
                ) : (
                  <div className="bg-white p-12 rounded-[2.5rem] text-center border border-gray-100 flex flex-col items-center justify-center shadow-xl shadow-slate-200/50">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <FaLock className="text-4xl text-gray-200" />
                    </div>
                    <h3 className="font-black text-2xl text-[#020617] mb-2 tracking-tighter">ميزة حصرية للمشتركين</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed font-medium">
                      إدارة الحملات الإعلانية متاحة فقط لأصحاب الباقات المدفوعة. قم بترقية حسابك الآن للوصول إلى هذه الميزة والمزيد.
                    </p>
                    <Link href={route('plans.index')}>
                      <button className="bg-[#020617] hover:bg-brand-red text-white font-black py-4 px-10 rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1">
                        استكشف باقات الترقية
                      </button>
                    </Link>
                  </div>
                )
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
                              articles={articles}
                              setActiveTab={setActiveTab}
                              setPostToEdit={setPostToEdit}
                          />
                        )}

                            {activeTab === 'likes' && (
                                <LikesTab likedPosts={liked_posts} />
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
      </main>

      <Footer />
    </div>
  );
}
