import React from 'react';
import Pagination from '@/Components/Pagination';
import ArticleListItem from '../ArticleListItem';
import { FaHeart } from 'react-icons/fa';

export default function LikesTab({ likedPosts }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FaHeart className="text-pink-500" /> مقالات أعجبتني
                    </h3>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold">
                        إجمالي: {likedPosts?.total || 0}
                    </span>
                </div>

                <div className="flex-1">
                    {likedPosts && likedPosts.data.length > 0 ? (
                        <>
                            {likedPosts.data.map((post) => (
                                <ArticleListItem key={post.id} post={post} isLikedView={true} />
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FaHeart className="text-3xl text-gray-300" />
                            </div>
                            <p className="font-medium">قائمة الإعجابات فارغة.</p>
                            <p className="text-xs mt-1 text-gray-400">تصفح المقالات وأضف ما يعجبك إلى المفضلة.</p>
                        </div>
                    )}
                </div>

                {likedPosts && likedPosts.data.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                        <Pagination links={likedPosts.links} />
                    </div>
                )}
            </div>
        </div>
    );
}
