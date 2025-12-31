import React from "react";
import { Search, Plus, Filter, X } from "lucide-react";

export default function PostHeader({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    onAddClick,
}) {
    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setCategoryFilter("");
    };

    return (
        <div className="flex flex-col gap-6 mb-8" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#001246]">
                        إدارة المقالات
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">
                        عرض، تحرير، والتحقق من مصداقية المقالات
                    </p>
                </div>

                <button
                    onClick={onAddClick}
                    className="flex items-center justify-center gap-2 bg-[#D00000] hover:bg-[#b00000] text-white px-8 py-4 rounded-[1.5rem] font-black shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>إضافة مقال جديد</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="lg:col-span-5 relative">
                    <Search
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="ابحث عن عنوان المقال أو المحتوى..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-[1px] rounded-2xl focus:ring-2 focus:ring-[#001246]/10 font-bold transition-all"
                    />
                </div>

                <div className="lg:col-span-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-[1px] rounded-2xl focus:ring-2 focus:ring-[#001246]/10 font-bold cursor-pointer appearance-none"
                    >
                        <option value="">كل الحالات</option>
                        <option value="published">منشور</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="rejected">مرفوض</option>
                    </select>
                </div>

                <div className="lg:col-span-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-[1px] rounded-2xl focus:ring-2 focus:ring-[#001246]/10 font-bold cursor-pointer appearance-none"
                    >
                        <option value="">كل الأقسام</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="lg:col-span-1">
                    <button
                        onClick={resetFilters}
                        title="إعادة ضبط الفلاتر"
                        className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-2xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
