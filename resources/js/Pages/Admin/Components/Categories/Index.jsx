import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import CategoryHeader from "./Partials/CategoryHeader";
import CategoryTable from "./Partials/CategoryTable";
import AdminPagination from "@/Layouts/AdminPagination";
import CategoryCreateModal from "./Partials/CategoryCreateModal";
import CategoryViewModal from "./Partials/CategoryViewModal";
import CategoryEditModal from "./Partials/CategoryEditModal";

export default function Index({ categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [viewingCategory, setViewingCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.categories.index"),
                { search: searchTerm },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleDelete = (category) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف الفئة (${category.name}) نهائياً!`,
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
                router.delete(route("admin.categories.destroy", category.id));
            }
        });
    };

    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl" dir="rtl">
            <Head title="إدارة الفئات" />

            <div className="py-6 px-4 md:px-8">
                <CategoryHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onAddClick={() => setIsCreateOpen(true)}
                />

                <div className="mt-8 bg-white p-4 md:p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <CategoryTable
                        categories={categories}
                        onEditClick={(category) => setEditingCategory(category)}
                        onDeleteClick={handleDelete}
                        onViewClick={(category) => setViewingCategory(category)}
                    />
                </div>

                {categories?.links && (
                    <AdminPagination
                        links={categories.links}
                        total={categories.total}
                        label="إجمالي الفئات"
                    />
                )}
            </div>

            <CategoryCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <CategoryViewModal
                category={viewingCategory}
                isOpen={!!viewingCategory}
                onClose={() => setViewingCategory(null)}
            />

            <CategoryEditModal
                category={editingCategory}
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;