import React from "react";
import { Layers , Search} from "lucide-react";



export default function CategoryHeader({searchTerm, setSearchTerm,onAddClick }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
                <h1 className="text-4xl font-black text-[#001246]">
                    إدارة الفئات
                </h1>
                <p className="text-slate-500 font-bold mt-2">
                    التحكم في فئات منصة المدقق.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 w-full md:w-80 shadow-sm focus-within:ring-4 focus-within:ring-[#D00000]/10 transition-all">
                    <Search size={22} className="text-slate-400 ml-4" />
                    <input
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                    placeholder="ابحث بالاسم الفئة..."
                    className="bg-transparent border-none outline-none text-base w-full font-bold focus:ring-0"
                    />
                </div>
                <button
                    onClick={onAddClick}
                    
                    className="flex items-center gap-2 px-6 py-4 bg-[#D00000] text-white font-black rounded-[1.5rem] hover:bg-[#001246] transition-all"
                >
                    <Layers size={20} />
                    إضافة فئة
                </button>
            </div>
        </div>
    );
}
