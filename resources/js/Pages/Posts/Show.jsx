import React from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Heart, Calendar, User, Tag, ThumbsUp } from "lucide-react";

export default function PostShow({ auth, post }) {
  const handleLike = () => {
    if (!auth.user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    router.post(
      route("posts.like", post.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          // يمكن إضافة toast notification هنا
        },
      }
    );
  };

  const getVerdictStyle = (verdict) => {
    const styles = {
      موثوق: {
        bg: "bg-green-50 border-green-200",
        text: "text-green-800",
        icon: "✓",
      },
      كاذب: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-800",
        icon: "✗",
      },
      مضلل: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
        icon: "⚠",
      },
    };
    return styles[verdict] || styles["مضلل"];
  };

  const verdictStyle = getVerdictStyle(post.ai_verdict);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={post.title} />

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Main Post Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* AI Verdict Banner */}
            <div
              className={`${verdictStyle.bg} border-b-4 ${verdictStyle.text} p-6`}
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">{verdictStyle.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">
                    تقييم الذكاء الاصطناعي: {post.ai_verdict}
                  </h3>
                  <p className="text-sm opacity-75">
                    تم التحقق من محتوى هذا المنشور بواسطة AI
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.user.name}
                    </p>
                    <p className="text-sm text-gray-500">الكاتب</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} />
                  <span className="text-sm">
                    {new Date(post.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {post.category && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag size={20} />
                    <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Post Body */}
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
              </div>

              {/* Engagement Section */}
              <div className="pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      disabled={!auth.user}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                        post.is_liked
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } ${!auth.user ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Heart
                        size={24}
                        className={post.is_liked ? "fill-current" : ""}
                      />
                      <span>{post.likes_count || 0} إعجاب</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status === "published" ? "منشور" : post.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Likes List (if any) */}
          {post.likes && post.likes.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ThumbsUp size={20} className="text-blue-600" />
                أعجب بهذا المنشور ({post.likes.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {post.likes.slice(0, 10).map((like) => (
                  <div
                    key={like.id}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {like.user?.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {like.user?.name}
                    </span>
                  </div>
                ))}
                {post.likes.length > 10 && (
                  <div className="flex items-center px-4 py-2 text-sm text-gray-500">
                    و {post.likes.length - 10} آخرين...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
