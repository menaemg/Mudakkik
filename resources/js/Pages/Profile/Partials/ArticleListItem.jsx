import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { FaUser, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaChevronLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UserBadge from '@/Components/UserBadge';

export default function ArticleListItem({ post, isLikedView = false, minimal = false, setActiveTab, setPostToEdit }) {

    const statusStyles = {
        published: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'منشور' },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'مراجعة' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', label: 'مرفوض' },
    };
    const statusKey = post.status || 'pending';
    const currentStatus = statusStyles[statusKey] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', label: statusKey };
    const postLink = post.status === 'published' ? route('posts.show', post.slug) : '#';

    const activeSubscription = post.user?.subscriptions?.find(sub => sub.status === 'active');
    const authorPlanSlug = activeSubscription?.plan?.slug || 'free';

    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (setPostToEdit && setActiveTab) {
            setPostToEdit(post);
            setActiveTab('edit_post');
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        Swal.fire({
            title: 'حذف المقال؟',
            text: "لن تتمكن من استرجاع هذا المحتوى!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، حذف',
            cancelButtonText: 'تراجع'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('posts.destroy', post.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('تم الحذف!', 'تم حذف المقال بنجاح.', 'success')
                });
            }
        });
    };

    return (
        <div className={`relative group flex items-center justify-between border-b border-gray-50 last:border-0 transition-all duration-300 ${minimal ? 'p-4 hover:bg-gray-50/50' : 'p-5 hover:bg-gray-50/80 hover:pl-8'}`}>

            <div className="absolute right-0 top-0 h-full w-1 bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
                 {post.status === 'published' ? (
                    <Link
                        href={postLink}
                        className={`font-bold text-gray-900 line-clamp-1 hover:text-brand-blue transition-colors w-fit ${minimal ? 'text-sm' : 'text-lg'}`}
                    >
                        {post.title}
                    </Link>
                ) : (
                    <span className={`font-bold text-gray-700 line-clamp-1 w-fit ${minimal ? 'text-sm' : 'text-lg'}`}>
                        {post.title}
                    </span>
                )}

                <div className="flex items-center flex-wrap gap-3 text-xs text-gray-400 font-medium">
                    {isLikedView && post.user && (
                        <div className="flex items-center gap-1.5 text-gray-600 bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm">
                            <FaUser size={9} className="text-gray-400" />
                            <span className="truncate max-w-[100px]">{post.user.name}</span>
                            <UserBadge user={post.user} planSlug={authorPlanSlug} className="scale-75" />
                        </div>
                    )}

                    {!isLikedView && (
                         <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                            {currentStatus.label}
                        </span>
                    )}

                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100/50">
                        <FaCalendarAlt size={10} /> {new Date(post.created_at).toLocaleDateString('ar-EG')}
                    </span>
                </div>
            </div>

             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                {post.status === 'published' && (
                    <Link href={postLink} title="عرض">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-colors">
                            <FaEye size={16} />
                        </Button>
                    </Link>
                )}

                {!isLikedView && (
                    <>
                        <Button
                            onClick={handleEditClick}
                            variant="ghost"
                            size="icon"
                            title="تعديل"
                            className="h-9 w-9 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                            <FaEdit size={16} />
                        </Button>

                        <Button
                            onClick={handleDeleteClick}
                            variant="ghost"
                            size="icon"
                            title="حذف"
                            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <FaTrash size={16} />
                        </Button>
                    </>
                )}

                {isLikedView && (
                      <Link href={postLink}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300 hover:text-brand-blue rounded-xl transition-colors">
                            <FaChevronLeft size={14} />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
