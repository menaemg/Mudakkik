import React, { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import CategoryHeader from "./Partials/CategoryHeader";
import CategoryTable from "./Partials/CategoryTable";
import CategoryCreateModal from "./Partials/CategoryCreateModal";
import AdminPagination from "@/Layouts/AdminPagination";

export default function Index({ categories, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "تمت العملية بنجاح",
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: "rounded-[2rem] font-sans" },
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "عذراً!",
                text: flash.error,
                confirmButtonColor: "#D00000",
            });
        }
    }, [flash]);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters?.search || "")) {
                router.get(
                    route("admin.categories.index"),
                    { search: searchTerm, page: 1 },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
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
            <Head title="إدارة الفئات - لوحة التحكم" />
            <CategoryHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddClick={() => setIsCreateOpen(true)}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
                <CategoryTable
                    categories={categories.data}
                    onDelete={handleDelete}
                />
                <AdminPagination
                    links={categories.links}
                    total={categories.total}
                    label="إجمالي الفئات"
                />
            </motion.div>

            <CategoryCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
