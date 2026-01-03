import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

export default function Edit(
  { mustVerifyEmail,
    status,
    stats,
    recent_posts,
    articles,
    liked_posts,
    ad_requests,
    categories,
    subscription,
    current_plan }) {
      const user = usePage().props.auth.user;

    const queryParams = new URLSearchParams(window.location.search);
    const initialTab = queryParams.get('tab');

    const [activeTab, setActiveTab] = useState(initialTab || 'overview');

    const canManageAds = stats.plan !== 'Free' && stats.plan !== 'مجاني';

    const [postToEdit, setPostToEdit] = useState(null);

    const dashboardStats = stats || {
        role: "عضو",
        plan: "Free",
        followers: 0,
        following: 0,
        views: 0,
        posts_count: 0
    };

    return (
        <AuthenticatedLayout>
            <Head title="لوحة التحكم" />

            <div className="min-h-screen bg-gray-50/50 py-12 font-sans" dir="rtl">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        <div className="lg:col-span-3">
                            <ProfileSidebar
                                user={user}
                                stats={dashboardStats}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                canManageAds={canManageAds}
                            />
                        </div>

                        <div className="lg:col-span-9">

                            {activeTab === 'ads' && (
                                canManageAds ? (
                                    <AdsTab adRequests={ad_requests} />
                                ) : (
                                    <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <FaLock className="text-4xl text-gray-300" />
                                        </div>
                                        <h3 className="font-black text-2xl text-gray-900 mb-2">ميزة حصرية للمشتركين</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                                            إدارة الحملات الإعلانية متاحة فقط لأصحاب الباقات المدفوعة. قم بترقية حسابك الآن للوصول إلى هذه الميزة والمزيد.
                                        </p>
                                        <Link href={route('plans.index')}>
                                            <button className="bg-brand-blue hover:bg-blue-700 text-white font-bold
                                            py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105">
                                                ترقية الحساب الآن
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
            </div>
        </AuthenticatedLayout>
    );
}
