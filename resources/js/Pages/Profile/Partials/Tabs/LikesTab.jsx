import React from 'react';
import Pagination from '@/Components/Pagination';
import ArticleListItem from '../ArticleListItem';
import { FaHeart } from 'react-icons/fa';

export default function LikesTab({ likedPosts }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-2 flex flex-col min-h-[calc(100vh-16rem)] h-full">

            <div className="flex items-center justify-between px-2 flex-shrink-0">
                <h3 className="font-black text-2xl text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/10">
                        <FaHeart size={20} />
                    </div>
                    المقالات المفضلة
                </h3>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المجموع</span>
                    <span className="text-2xl font-black text-gray-900">{likedPosts?.total || 0}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white overflow-hidden flex-grow flex flex-col relative h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500/20 via-pink-500/40 to-pink-500/20"></div>

                <div className="flex-1 w-full flex flex-col">
                    {likedPosts?.data?.length > 0 ? (
                        <div className="flex flex-col h-full">
                            <div className="divide-y divide-gray-50 w-full flex-grow">
                                {likedPosts.data.map((post) => (
                                    <div key={post.id} className="hover:bg-pink-50/10 transition-colors duration-300">
                                        <ArticleListItem post={post} isLikedView={true} />
                                    </div>
                                ))}
                                {likedPosts.data.length < 5 && (
                                    <div className="bg-gray-50/10 flex-grow"></div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse-slow">
                                <FaHeart className="text-5xl text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد إعجابات</h3>
                            <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                                تصفح المقالات وأضف ما يعجبك إلى قائمتك المفضلة للرجوع إليها لاحقاً.
                            </p>
                        </div>
                    )}
                </div>

                {likedPosts?.data?.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center backdrop-blur-sm mt-auto shrink-0">
                        <Pagination links={likedPosts.links} />
                    </div>
                )}
            </div>
        </div>
    );
}
