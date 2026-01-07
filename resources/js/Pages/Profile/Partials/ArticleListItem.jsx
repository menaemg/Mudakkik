import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { FaUser, FaCalendarAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UserBadge from '@/Components/UserBadge';

export default function ArticleListItem({ post, isLikedView = false, minimal = false, setActiveTab, setPostToEdit }) {

    const statusStyles = {
        published: { bg: 'bg-green-100', text: 'text-green-700', label: 'منشور' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'مراجعة' },
        rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'مرفوض' },
    };
    const statusKey = post.status || 'pending';
    const currentStatus = statusStyles[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-600', label: statusKey };
    const postLink = post.status === 'published' ? route('posts.show', post.slug) : '#';

    const activeSubscription = post.user?.subscriptions?.find(sub => sub.status === 'active');
    const authorPlanSlug = activeSubscription?.plan?.slug || 'free';

    const handleEditClick = () => {
        if (setPostToEdit && setActiveTab) {
            setPostToEdit(post);
            setActiveTab('edit_post');
        } else {
            console.error("Missing props: setPostToEdit or setActiveTab");
        }
    };

    const handleDeleteClick = () => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لا يمكن استرجاع المقال بعد الحذف!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، احذفه',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('posts.destroy', post.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('تم الحذف!', 'تم حذف المقال بنجاح.', 'success');
                    },
                    onError: () => {
                        Swal.fire('خطأ!', 'حدث خطأ أثناء حذف المقال.', 'error');
                    }
                });
            }
        });
    };

return (
        <div className={`flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group ${minimal ? 'p-3' : 'p-4'}`}>
            <div className="flex flex-col gap-1 flex-1">
                 {post.status === 'published' ? (
                    <Link
                        href={postLink}
                        className={`font-bold text-gray-900 line-clamp-1 hover:text-brand-blue transition-colors w-fit ${minimal ? 'text-sm' : 'text-base'}`}
                    >
                        {post.title}
                    </Link>
                ) : (
                    <span className={`font-bold text-gray-900 line-clamp-1 w-fit ${minimal ? 'text-sm' : 'text-base'}`}>
                        {post.title}
                    </span>
                )}


                <div className="flex items-center gap-3 text-xs text-gray-400">

                    {isLikedView && post.user && (
                        <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            <FaUser size={8} />
                            <span>{post.user.name}</span>
                            <UserBadge user={post.user} planSlug={authorPlanSlug} />
                        </div>
                    )}

                    {!isLikedView && (
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                          ${currentStatus.bg} ${currentStatus.text}`}>
                            {currentStatus.label}
                        </span>
                    )}

                    <span className="flex items-center gap-1">
                        <FaCalendarAlt size={10} /> {new Date(post.created_at).toLocaleDateString('ar-EG')}
                    </span>
                </div>
            </div>

             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {post.status === 'published' && (
                    <Link href={postLink} title="عرض">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-brand-blue hover:bg-blue-50">
                            <FaEye size={14} />
                        </Button>
                    </Link>
                )}

                {!isLikedView && (
                    <>
                        <Button
                            onClick={handleEditClick}
                            variant="ghost"
                            size="sm"
                            title="تعديل"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50"
                        >
                            <FaEdit size={14} />
                        </Button>

                        <Button
                            onClick={handleDeleteClick}
                            variant="ghost"
                            size="sm"
                            title="حذف"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                            <FaTrash size={14} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
