import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Heart, MessageSquare, Eye } from "lucide-react";

export default function PostsIndex({ auth, posts }) {
  const getVerdictColor = (verdict) => {
    const colors = {
      موثوق: "bg-green-100 text-green-800",
      كاذب: "bg-red-100 text-red-800",
      مضلل: "bg-yellow-100 text-yellow-800",
    };
    return colors[verdict] || "bg-gray-100 text-gray-800";
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="المنشورات" />

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">المنشورات</h1>
            <p className="text-gray-600 mt-2">تصفح آخر المنشورات من المجتمع</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.data.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {post.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString(
                            "ar-EG"
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getVerdictColor(
                        post.ai_verdict
                      )}`}
                    >
                      {post.ai_verdict}
                    </span>
                  </div>

                  {/* Content */}
                  <Link href={route("posts.show", post.id)}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.body}
                    </p>
                  </Link>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {post.category?.name || "عام"}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart
                        className={
                          post.is_liked ? "fill-red-500 text-red-500" : ""
                        }
                        size={20}
                      />
                      <span className="text-sm font-semibold">
                        {post.likes_count || 0}
                      </span>
                    </div>

                    <Link
                      href={route("posts.show", post.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Eye size={16} />
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {posts.links && posts.links.length > 3 && (
            <div className="mt-12 flex justify-center gap-2">
              {posts.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    link.active
                      ? "bg-blue-600 text-white"
                      : link.url
                      ? "bg-white text-gray-700 hover:bg-gray-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  preserveScroll
                />
              ))}
            </div>
          )}

          {posts.data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد منشورات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
