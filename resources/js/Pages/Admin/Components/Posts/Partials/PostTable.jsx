import React from "react";
import {
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Star,
    Eye
} from "lucide-react";
import { router } from "@inertiajs/react";

export default function PostTable({ posts, onEditClick, onDeleteClick,onViewClick }) {
    const handleToggleFeatured = (id) => {
        router.patch(
            route("admin.posts.toggle-featured", id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const AIVerdictBadge = ({ verdict }) => {
        const styles = {
            trusted: {
                bg: "bg-green-50",
                text: "text-green-700",
                icon: <CheckCircle size={14} />,
                label: "موثوق",
            },
            fake: {
                bg: "bg-red-50",
                text: "text-red-700",
                icon: <XCircle size={14} />,
                label: "زائف",
            },
            misleading: {
                bg: "bg-orange-50",
                text: "text-orange-700",
                icon: <AlertCircle size={14} />,
                label: "مضلل",
            },
        };
        const current = styles[verdict] || {
            bg: "bg-slate-50",
            text: "text-slate-500",
            label: "غير محدد",
        };

        return (
            <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${current.bg} ${current.text}`}
            >
                {current.icon}
                <span>{current.label}</span>
            </div>
        );
    };

    return (
        <div
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
            dir="rtl"
        >
            <table className="w-full text-right border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-6 text-slate-500 font-black text-sm">
                            المقال
                        </th>
                        <th className="p-6 text-slate-500 font-black text-sm">
                            الفئة والكاتب
                        </th>
                        <th className="p-6 text-slate-500 font-black text-sm text-center">
                            حكم الذكاء الاصطناعي
                        </th>
                        <th className="p-6 text-slate-500 font-black text-sm text-center">
                            الحالة
                        </th>
                        <th className="p-6 text-slate-500 font-black text-sm text-center">
                            مميز
                        </th>
                        <th className="p-6 text-slate-500 font-black text-sm text-center">
                            الإجراءات
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {posts.data.map((post) => (
                        <tr
                            key={post.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                        >

                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                        <img
                                            src={post.image}
                                            className="w-full h-full object-cover"
                                            alt={post.title}
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/assets/images/post.webp")
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-black text-[#001246] line-clamp-1">
                                            {post.title}
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags?.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="p-6">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-700">
                                        {post.category?.name}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">
                                        بواسطة: {post.user?.name}
                                    </span>
                                </div>
                            </td>

                            <td className="p-6 text-center">
                                <div className="flex justify-center">
                                    <AIVerdictBadge verdict={post.ai_verdict} />
                                </div>
                            </td>

                        
                            <td className="p-6 text-center">
                                <span
                                    className={`text-xs font-black px-3 py-1 rounded-lg ${
                                        post.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : post.status === "pending"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {post.status === "published"
                                        ? "منشور"
                                        : post.status === "pending"
                                        ? "قيد المراجعة"
                                        : "مرفوض"}
                                </span>
                            </td>

                           
                            <td className="p-6 text-center">
                                <button
                                    onClick={() =>
                                        handleToggleFeatured(post.id)
                                    }
                                    className={`p-2 rounded-xl transition-all ${
                                        post.is_featured
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-slate-100 text-slate-400"
                                    }`}
                                >
                                    <Star
                                        size={20}
                                        fill={
                                            post.is_featured
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>
                            </td>

                           
                            <td className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onViewClick(post)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                        title="عرض التفاصيل"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => onEditClick(post)}
                                        className="p-2 text-slate-400 hover:text-[#001246] hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(post)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {posts.data.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <AlertCircle size={40} />
                    </div>
                    <p className="text-slate-400 font-black text-xl">
                        لا توجد مقالات تطابق بحثك حالياً
                    </p>
                </div>
            )}
        </div>
    );
}
