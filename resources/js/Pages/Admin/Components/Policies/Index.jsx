import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router, Head, usePage, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { ShieldCheck, FileText, Plus, Edit2, Trash2, X, Search, AlertCircle } from "lucide-react";
import AdminPagination from "@/Layouts/AdminPagination.jsx";

export default function Index({ policies, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: "",
        content: "",
    });

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingPolicy(null);
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
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters?.search || "")) {
                router.get(route("admin.policies.index"), 
                    { search: searchTerm }, 
                    { preserveState: true, replace: true }
                );
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters?.search]);

    const openCreateModal = () => {
        setEditMode(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (policy) => {
        setEditMode(true);
        setEditingPolicy(policy);
        setData({
            type: policy.type,
            content: policy.content,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(route("admin.policies.update", editingPolicy.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("admin.policies.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (policy) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف سياسة (${policy.type}) نهائياً، قد يؤثر هذا على عمل المدقق الآلي.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D00000",
            confirmButtonText: "نعم، احذف",
            cancelButtonText: "إلغاء",
            customClass: { popup: "rounded-[2rem] font-sans" },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.policies.destroy", policy.id));
            }
        });
    };

    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 rtl text-right" dir="rtl">
            <Head title="إدارة السياسات - مدقق" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001246]">سياسات الموقع</h1>
                    <p className="text-slate-500 mt-2 text-sm">تحكم في القواعد التي يتبعها الذكاء الاصطناعي لمراجعة المقالات</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-[#001246] text-white px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} />
                    <span>إضافة سياسة جديدة</span>
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="ابحث في السياسات..."
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
                                <th className="px-6 py-4 text-right text-slate-600 font-semibold text-sm uppercase tracking-wider">نوع السياسة</th>
                                <th className="px-6 py-4 text-right text-slate-600 font-semibold text-sm uppercase tracking-wider">المحتوى</th>
                                <th className="px-6 py-4 text-center text-slate-600 font-semibold text-sm uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {policies.data.length > 0 ? policies.data.map((policy) => (
                                <tr key={policy.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#001246]">
                                        <span className="flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-blue-600" />
                                            {policy.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm max-w-xs truncate">
                                        {policy.content}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(policy)} 
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(policy)} 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400">لا توجد سياسات مضافة حالياً</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={policies.links} total={policies.total} label="إجمالي السياسات" />
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl relative"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#001246]">
                                    {editMode ? "تعديل السياسة" : "إضافة سياسة جديدة"}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">نوع السياسة</label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:border-[#001246] focus:ring-0 transition-all ${errors.type ? 'border-red-500' : ''}`}
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        placeholder="مثلاً: content_review"
                                        
                                    />
                                    {errors.type && <p className="text-red-500 text-xs mt-2">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">نص السياسة (التعليمات)</label>
                                    <textarea
                                        rows="6"
                                        className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:border-[#001246] focus:ring-0 transition-all ${errors.content ? 'border-red-500' : ''}`}
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="اكتب التعليمات التي يجب أن يتبعها الذكاء الاصطناعي هنا..."
                                    />
                                    {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content}</p>}
                                   
                                </div>
                                
                                <button
                                    disabled={processing}
                                    className="w-full bg-[#001246] text-white py-4 rounded-xl font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all"
                                >
                                    {processing ? "جاري الحفظ..." : (editMode ? "تحديث السياسة" : "إنشاء السياسة")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;