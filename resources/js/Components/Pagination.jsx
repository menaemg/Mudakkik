import React from 'react';
import { Link } from '@inertiajs/react';

const decodeLabel = (label) => {
    const entities = {
        '&laquo;': '«',
        'Previous': '«',
        '&raquo;': '»',
        'Next': '»',
        '&hellip;': '…',
        '&amp;': '&',
    };

    return label.replace(/&[a-z]+;/gi, (match) => entities[match] || match);
};

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav role="navigation" aria-label="Pagination Navigation" className="flex justify-center items-center gap-1 mt-6 flex-wrap">
            {links.map((link, key) => {
                const isCurrent = link.active;
                const isDisabled = !link.url;

                return isDisabled ? (
                    <div
                        key={key}
                        className="px-3 py-1 text-sm text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed opacity-50"
                    >
                        {decodeLabel(link.label)}
                    </div>
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-1 text-sm border rounded-md transition-all duration-300 ${
                            isCurrent
                                ? 'bg-[#000a2e] text-white border-[#000a2e]'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-[#000a2e]'
                        }`}
                    >
                        {decodeLabel(link.label)}
                    </Link>
                );
            })}
        </nav>
    );
}
