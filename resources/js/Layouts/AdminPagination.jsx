import React from "react";
import { Link } from "@inertiajs/react";

// Safely decode HTML entities from Laravel pagination
const decodeLabel = (label) => {
    const entities = {
        '&laquo;': '«',
        '&raquo;': '»',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&nbsp;': ' ',
    };
    return label.replace(/&[a-z]+;/gi, (match) => entities[match] || match);
};

export default function AdminPagination({ links, total, label = "الإجمالي" }) {
    if (links.length <= 3) return null;

    return (
        <div className="p-6 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
            <span className="text-sm font-black text-slate-500">
                {label}: {total}
            </span>

            <div className="flex flex-wrap justify-center gap-2">
                {links.map((link, i) => (
                    link.url === null ? (

                        <span
                            key={i}
                            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-100 text-slate-300 bg-white/50 cursor-not-allowed"
                        >
                            {decodeLabel(link.label)}
                        </span>
                    ) : (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${link.active
                                    ? 'bg-[#D00000] text-white border-[#D00000] shadow-lg shadow-red-200'
                                    : 'bg-white text-[#001246] border-slate-200 hover:border-[#D00000] hover:text-[#D00000]'
                                }`}
                        >
                            {decodeLabel(link.label)}
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
}
