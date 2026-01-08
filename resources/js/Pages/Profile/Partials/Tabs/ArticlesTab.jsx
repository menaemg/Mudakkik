import React from 'react';
import { Button } from "@/components/ui/button";
import Pagination from '@/Components/Pagination';
import ArticleListItem from '../ArticleListItem';
import { FaPenNib, FaPlus, FaLayerGroup } from 'react-icons/fa';

export default function ArticlesTab({ articles, setActiveTab, setPostToEdit }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 flex flex-col min-h-[calc(100vh-16rem)] h-full">

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-1 flex items-center justify-between flex-shrink-0">
                <div className="p-6 md:p-8">
                    <h3 className="font-black text-2xl text-gray-900 flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shadow-sm">
                            <FaPenNib size={18} />
                        </div>
                        إدارة المحتوى
                    </h3>
                    <p className="text-gray-500 font-medium text-sm">استعرض، عدل، وانشر مقالاتك بكل سهولة.</p>
                </div>

                <div className="flex items-center gap-4 px-8">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إجمالي المقالات</span>
                        <span className="text-2xl font-black text-gray-900">{articles?.total || 0}</span>
                    </div>

                    <Button
                        onClick={() => setActiveTab('create_post')}
                        className="h-12 px-6 bg-[#020617] hover:bg-brand-red text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <FaPlus size={12} />
                        <span>مقال جديد</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white overflow-hidden flex-grow flex flex-col relative h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-brand-red/20 to-gray-100 z-10"></div>

                <div className="flex-1 flex flex-col w-full">
                    {articles?.data?.length > 0 ? (
                        <div className="flex flex-col h-full">
                            <div className="divide-y divide-gray-50 w-full flex-grow">
                                {articles.data.map((post) => (
                                    <div key={post.id} className="transition-colors hover:bg-[#f8fafc]">
                                        <ArticleListItem
                                            post={post}
                                            setActiveTab={setActiveTab}
                                            setPostToEdit={setPostToEdit}
                                        />
                                    </div>
                                ))}
                                {articles.data.length < 6 && (
                                    <div className="bg-white flex-grow"></div>
                                )}
                            </div>

                             <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center backdrop-blur-sm mt-auto">
                                <Pagination links={articles.links} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse-slow">
                                <FaLayerGroup className="text-5xl text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">مساحتك فارغة</h3>
                            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8 leading-relaxed">
                                لم تقم بنشر أي محتوى حتى الآن. صوتك مهم، ابدأ بمشاركة أفكارك مع العالم.
                            </p>

                            <Button
                                onClick={() => setActiveTab('create_post')}
                                className="bg-white border-2 border-gray-100 hover:border-brand-blue hover:text-brand-blue text-gray-600 font-bold py-6 px-8 rounded-2xl transition-all"
                            >
                                كتابة أول مقال
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
