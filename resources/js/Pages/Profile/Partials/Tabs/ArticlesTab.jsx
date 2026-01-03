import React from 'react';
import { Button } from "@/components/ui/button";
import Pagination from '@/Components/Pagination';
import ArticleListItem from '../ArticleListItem';
import { FaPenNib, FaPlus } from 'react-icons/fa';

export default function ArticlesTab({ articles, setActiveTab, setPostToEdit }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">

                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <FaPenNib className="text-brand-red" /> مقالاتي
                        </h3>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold">
                            إجمالي: {articles?.total || 0}
                        </span>
                    </div>

                    <Button
                        onClick={() => setActiveTab('create_post')}
                        className="bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs h-9"
                    >
                        <FaPlus className="ml-1" /> مقال جديد
                    </Button>
                </div>

                <div className="flex-1">
                    {articles?.data?.length > 0 ? (
                        <>
                            {articles.data.map((post) => (
                                <ArticleListItem
                                    key={post.id}
                                    post={post}
                                    setActiveTab={setActiveTab}
                                    setPostToEdit={setPostToEdit}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FaPenNib className="text-3xl text-gray-300" />
                            </div>
                            <p className="font-medium">لم تقم بنشر أي مقالات حتى الآن.</p>

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

                {articles?.data?.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                        <Pagination links={articles.links} />
                    </div>
                )}
            </div>
        </div>
    );
}
