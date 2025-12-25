import React from "react";
import { Link } from "@inertiajs/react";

export default function UserPagination({ links, total }) {
    return (
        <div className="p-6 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm font-bold text-slate-500">الإجمالي: {total}</span>
            <div className="flex gap-2">
                {links.map((link, i) => (
                    <Link 
                        key={i} 
                        href={link.url || "#"} 
                        className={`px-4 py-2 rounded-xl text-sm font-bold border ${link.active ? 'bg-[#D00000] text-white' : 'bg-white'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}