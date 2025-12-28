import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Head, usePage, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Tag, Hash, Plus, Edit2, Trash2, X, Search } from "lucide-react";
import AdminPagination from "@/Layouts/AdminPagination.jsx";

export default function Index({ tags, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const { flash } = usePage().props;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
    });
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingTag(null);
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) closeModal();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, closeModal]);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "تمت العملية",
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: "rounded-[2rem] font-sans" },
            });
            closeModal();
        }
    }, [flash, closeModal]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters?.search || "")) {
                router.get(route("admin.tags.index"), 
                    { search: searchTerm }, 
                    { preserveState: true, replace: true }
                );
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters.search]);

    const openCreateModal = () => {
        setEditMode(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (tag) => {
        setEditMode(true);
        setEditingTag(tag);
        setData("name", tag.name);
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            if (!editingTag?.id) return; 
            put(route("admin.tags.update", editingTag.id));
        } else {
            post(route("admin.tags.store"));
        }
    };

    const handleDelete = (tag) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف وسام (#${tag.name}) نهائياً.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D00000",
            confirmButtonText: "نعم، احذف",
            cancelButtonText: "إلغاء",
            customClass: { popup: "rounded-[2rem] font-sans" },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.tags.destroy", tag.id));
            }
        });
    };

    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl text-right" dir="rtl">
            <Head title="إدارة الأوسمة - مدقق" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001246]">الأوسمة</h1>
                    <p className="text-slate-500 mt-2 text-sm">إدارة كلمات البحث والهاشتاجات المتاحة للصحفيين</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-[#001246] text-white px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} />
                    <span>إضافة وسام جديد</span>
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="ابحث عن وسام..."
                    className="w-full pr-12 pl-4 py-3 rounded-2xl border-slate-200 focus:border-[#001246] focus:ring-0 shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-right text-slate-600 font-semibold text-sm uppercase tracking-wider">الوسم</th>
                                <th className="px-6 py-4 text-right text-slate-600 font-semibold text-sm uppercase tracking-wider">عدد المقالات</th>
                                <th className="px-6 py-4 text-center text-slate-600 font-semibold text-sm uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tags.data.length > 0 ? tags.data.map((tag) => (
                                <tr key={tag.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#001246]">
                                        <span className="flex items-center gap-2">
                                            <Hash size={16} className="text-slate-400" />
                                            {tag.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                            {tag.posts_count} مقال
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(tag)} 
                                                aria-label="تعديل"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tag)} 
                                                aria-label="حذف"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400">لا توجد أوسمة مطابقة للبحث</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination links={tags.links} total={tags.total} label="إجمالي الأوسمة" />
            </motion.div>
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm shadow-inner">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#001246]">
                                    {editMode ? "تعديل الوسم" : "إضافة وسام جديد"}
                                </h2>
                                <button 
                                    onClick={closeModal} 
                                    aria-label="إغلاق"
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">اسم الوسم</label>
                                    <div className="relative">
                                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            className={`w-full pr-10 pl-4 py-3 rounded-xl border-slate-200 focus:border-[#001246] focus:ring-0 transition-all ${errors.name ? 'border-red-500' : ''}`}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="مثلاً: أخبار_مضللة"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
                                </div>
                                
                                <button
                                    disabled={processing}
                                    className="w-full bg-[#001246] text-white py-4 rounded-xl font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/10"
                                >
                                    {processing ? "جاري المعالجة..." : (editMode ? "حفظ التغييرات" : "إضافة الوسم")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;