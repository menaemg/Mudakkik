import React from "react";
import { EyeIcon, Edit2, Trash2, Calendar } from "lucide-react";

export default function CategoryTable({ categories ,onDelete}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[900px]">
                <thead>
                    <tr className="bg-slate-50/80 text-[#001246] border-b border-slate-100">
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            الفئة
                        </th>
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            الرابط المختصر
                        </th>
                        <th className="px-10 py-7 font-black text-sm uppercase">
                             ناريخ الانشاء
                        </th>
                        <th className="px-10 py-7 font-black text-sm text-center">
                            الإجراءات
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="hover:bg-slate-50/50 transition-all group"
                        >
                            <td className="px-10 py-7">
                                <div className="flex items-center gap-5">
                                    <div className="text-right">
                                        <div className="text-[17px] font-black text-[#001246] group-hover:text-[#D00000] transition-colors">
                                            {category.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-7">
                                <div className="flex items-center gap-5">
                                    <div className="text-right">
                                        <div className="text-[17px] font-black text-[#001246] group-hover:text-[#D00000] transition-colors">
                                            {category.slug}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-7 text-center">
                                <div className="inline-flex items-center gap-2 text-sm font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Calendar
                                        size={14}
                                        className="text-[#D00000]"
                                    />
                                    {new Date(
                                        category.created_at
                                    ).toLocaleDateString("ar-EG")}
                                </div>
                            </td>
                            <td className="px-10 py-7 text-center">
                                <div className="flex justify-center items-center gap-3">
                                    <button
                                       
                                        className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-[1rem] transition-all"
                                    >
                                        <EyeIcon size={18} />
                                    </button>
                                    <button
                                      
                                        className="p-3 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-[1rem] transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                       onClick={()=>onDelete(category)}
                                        className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-[1rem] transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
