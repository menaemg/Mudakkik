import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Trash2, Globe, CheckCircle, XCircle, X, Save } from "lucide-react";
import Swal from "sweetalert2";

export default function Index({ domains, filters = {} }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        domain: '',
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('admin.trusted-domains.store'), {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
                Swal.fire({
                    title: "تم!",
                    text: "تم إضافة الموقع بنجاح",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: "rounded-[2rem] font-sans" },
                });
            },
        });
    };

    const handleDelete = (domain) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: `سيتم حذف (${domain.name}) نهائياً!`,
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

    const toggleStatus = (id) => {
        router.patch(route("admin.trusted-domains.toggle", id));
    };

    return (
        <div className="space-y-8 font-sans pb-20 px-4 md:px-6 text-right" dir="rtl">
            <Head title="إدارة المصادر الموثوقة" />

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
                    className="flex items-center justify-center gap-2 bg-[#D00000] hover:bg-[#b00000] text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg"
                >
                    <Plus size={20} />
                    إضافة مصدر جديد
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 text-[#001246] font-black text-sm uppercase">اسم الموقع</th>
                                <th className="p-6 text-[#001246] font-black text-sm uppercase text-center">النطاق (Domain)</th>
                                <th className="p-6 text-[#001246] font-black text-sm uppercase text-center">الحالة</th>
                                <th className="p-6 text-[#001246] font-black text-sm uppercase text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {domains.length > 0 ? domains.map((domain) => (
                                <tr key={domain.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="p-6 font-bold text-[#001246]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#001246]">
                                                <Globe size={18} />
                                            </div>
                                            {domain.name}
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg text-xs">
                                            {domain.domain}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button 
                                            onClick={() => toggleStatus(domain.id)}
                                            className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full w-fit mx-auto transition-all ${
                                                domain.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                                            }`}
                                        >
                                            {domain.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            <span className="text-xs font-black italic">{domain.is_active ? 'نشط' : 'معطل'}</span>
                                        </button>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => handleDelete(domain)}
                                            className="p-2 text-slate-300 hover:text-[#D00000] hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-400 font-bold">لا توجد مصادر مضافة حالياً</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001246]/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-xl font-black text-[#001246]">إضافة مصدر جديد</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="p-8 space-y-6 text-right">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم الموقع</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-[#001246]/10 focus:ring-0 font-bold text-right"
                                        placeholder="مثل: اليوم السابع"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-[#D00000] text-xs mt-2 font-bold">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 text-right">النطاق (Domain)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-[#001246]/10 focus:ring-0 font-bold text-left"
                                        placeholder="youm7.com"
                                        dir="ltr"
                                        value={data.domain}
                                        onChange={e => setData('domain', e.target.value)}
                                    />
                                    {errors.domain && <p className="text-[#D00000] text-xs mt-2 font-bold">{errors.domain}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#001246] hover:bg-[#D00000] text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {processing ? 'جاري الحفظ...' : 'حفظ المصدر'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;