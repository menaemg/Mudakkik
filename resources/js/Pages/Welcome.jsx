import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import HeroSection from '@/Pages/Home/HeroSection';
import FeaturedNews from '@/Pages/Home/FeaturedNews';
import TopStories from '@/Pages/Home/TopStories';
import TopicsSection from '@/Pages/Home/TopicsSection';
import EntertainmentSection from '@/Pages/Home/EntertainmentSection';
import BusinessSection from '@/Pages/Home/BusinessSection';
import ContentGridSection from '@/Pages/Home/ContentGridSection';
import BannerSection from '@/Pages/Home/BannerSection';
import MoreNewsSection from '@/Pages/Home/MoreNewsSection';
import Footer from '@/Components/Footer';

export default function Welcome({
    auth,
    ticker,
    hero,
    featured,
    editorsChoice,
    topStories,
    entertainment,
    topics,
    business,
    moreNews,
    ads
}) {
    return (
        <>
            <Head title="الرئيسية - مدقق نيوز" />

            <div className="min-h-screen bg-white text-right" dir="rtl">

                <Header auth={auth} ticker={ticker} />

                <main>
                    <HeroSection hero={hero} ads={ads} />

                    <FeaturedNews featured={featured} editorsChoice={editorsChoice} ads={ads} />

                    <TopStories stories={topStories} ads={ads} />

                    <EntertainmentSection data={entertainment} />

                    <TopicsSection topics={topics} ads={ads} />

                    <BusinessSection articles={business} ads={ads} />

                    <ContentGridSection />

                    <BannerSection ads={ads} />

                    <MoreNewsSection articles={moreNews} ads={ads} />
                </main>

                <Footer/>

            </div>
        </>
    );
}
