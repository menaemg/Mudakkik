import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import UserHeader from "./Partials/UserHeader.jsx";
import UserTable from "./Partials/UserTable.jsx";
import UserViewModal from "./Partials/UserViewModal.jsx";
import UserCreateModal from "./Partials/UserCreateModal.jsx";
import UserEditModal from "./Partials/UserEditModal.jsx";
import AdminPagination from "@/Layouts/AdminPagination.jsx";

export default function Index({ users, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters?.search || "")) {
                router.get(
                    route("admin.users.index"),
                    { search: searchTerm, page: 1 },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters.search]);

    const getRoleBadge = (role) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-700 border-red-200 shadow-sm shadow-red-100";
            case "journalist":
                return "bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-100";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const handleDelete = (user) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف حساب (${user.name}) نهائياً!`,
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
                router.delete(route("admin.users.destroy", user.id));
            }
        });
    };
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setIsViewOpen(false);
                setIsCreateOpen(false);
                setIsEditOpen(false);
                setSelectedUser(null);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);
    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl" dir="rtl">
            <Head title="إدارة المستخدمين - لوحة التحكم" />

            <UserHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddClick={() => setIsCreateOpen(true)}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
                <UserTable
                    users={users.data}
                    getRoleBadge={getRoleBadge}
                    onView={(user) => {
                        setSelectedUser(user);
                        setIsViewOpen(true);
                    }}
                    onEdit={(user) => {
                        setSelectedUser(user);
                        setIsEditOpen(true);
                    }}
                    onDelete={handleDelete}
                />

                <AdminPagination
                    links={users.links}
                    total={users.total}
                    label="إجمالي المستخدمين"
                />
            </motion.div>

            <UserViewModal
                isOpen={isViewOpen}
                user={selectedUser}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedUser(null);
                }}
                getRoleBadge={getRoleBadge}
            />

            <UserCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <UserEditModal
                isOpen={isEditOpen}
                user={selectedUser}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                }}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
