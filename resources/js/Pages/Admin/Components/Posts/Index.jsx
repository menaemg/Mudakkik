import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import PostHeader from "./Partials/PostHeader";
import PostTable from "./Partials/PostTable";
import AdminPagination from "@/Layouts/AdminPagination";
import PostCreateModal from "./Partials/PostCreateModal";
import PostView from "./Partials/PostView";
import PostEdit from "./Partials/PostEdit";

export default function Index({ posts, filters, categories, tags }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [categoryFilter, setCategoryFilter] = useState(filters.category || "");

  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const isChanged =
        searchTerm !== (filters?.search || "") ||
        statusFilter !== (filters?.status || "") ||
        categoryFilter !== (filters?.category || "");

      if (isChanged) {
        router.get(
          route("admin.posts.index"),
          {
            search: searchTerm,
            status: statusFilter,
            category: categoryFilter,
            page: 1,
          },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
          }
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, categoryFilter]);
  const handleDelete = (post) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم حذف المقال (${post.title}) نهائياً!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D00000",
      cancelButtonColor: "#001246",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      customClass: { popup: "rounded-[2rem] font-sans" },
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("admin.posts.destroy", post.id));
      }
    });
  };

  return (
    <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl" dir="rtl">
      <Head title="إدارة المقالات" />

      <div className="py-6 px-4 md:px-8">
        <AnimatePresence mode="wait">
          {viewingPost ? (
            <motion.div
              key="view"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <PostView
                post={viewingPost}
                onBack={() => setViewingPost(null)}
              />
            </motion.div>
          ) : editingPost ? (
            <motion.div
              key="edit"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
            >
              <PostEdit
                post={editingPost}
                categories={categories}
                tags={tags}
                onBack={() => setEditingPost(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PostHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                onAddClick={() => setIsCreateOpen(true)}
              />

              <div className="mt-8 bg-white p-4 md:p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <PostTable
                  posts={posts}
                  onEditClick={(post) => setEditingPost(post)}
                  onDeleteClick={handleDelete}
                  onViewClick={(post) => setViewingPost(post)}
                />
              </div>

              <AdminPagination
                links={posts.links}
                total={posts.total}
                label="إجمالي المقالات"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <PostCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}

Index.layout = (page) => <AdminLayout children={page} />;
