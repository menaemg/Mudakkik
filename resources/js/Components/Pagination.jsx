import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex justify-center items-center gap-1 mt-6 flex-wrap">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-3 py-1 text-sm text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed opacity-50"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3 py-1 text-sm border rounded-md transition-all duration-300 ${
                            link.active
                                ? 'bg-[#000a2e] text-white border-[#000a2e]'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-[#000a2e]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                )
            ))}
        </div>
    );
}
