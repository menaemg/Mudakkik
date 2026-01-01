import React, { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ShieldCheck, Plus } from "lucide-react";
import Swal from "sweetalert2";
import DomainTable from "./Partials/DomainTable";
import DomainCreateModal from "./Partials/DomainCreateModal";

export default function Index({ domains }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleDelete = (domain) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف المصدر (${domain.name}) من القائمة الموثوقة!`,
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
                router.delete(route("admin.trusted-domains.destroy", domain.id));
            }
        });
    };

    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl text-right" dir="rtl">
            <Head title="إدارة المصادر الموثوقة" />

            {/* Header البسيط */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-[#001246] p-4 rounded-2xl shadow-lg shadow-blue-900/20">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#001246]">المصادر الموثوقة</h1>
                        <p className="text-slate-400 font-bold text-sm">إدارة المواقع التي يعتمد عليها مدقق الحقائق</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#D00000] hover:bg-[#b00000] text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-900/10"
                >
                    <Plus size={20} />
                    إضافة مصدر جديد
                </button>
            </div>

            {/* الجدول */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
                <DomainTable
                    domains={domains}
                    onDelete={handleDelete}
                />
            </motion.div>

            {/* المودال الخاص بالإضافة */}
            <DomainCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;