import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { router } from '@inertiajs/react';

export default function Search({ onToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchRef = useRef(null);

    const toggleSearch = (state) => {
        setIsOpen(state);
        if (onToggle) onToggle(state);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        toggleSearch(false);
        router.get(route('posts.index'), { search: query });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                if (query === '') toggleSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [query]);

    return (
        <div className="relative" ref={searchRef}>
            {isOpen ? (
                <form onSubmit={handleSearchSubmit} className="absolute top-1/2 -translate-y-1/2 left-[-10px] w-[calc(100vw-110px)] md:w-[600px] lg:w-[800px] z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ابحث في مدقق نيوز..."
                            autoFocus
                            className="w-full bg-[#000a2e] text-white border border-white/20 rounded-full py-2.5 pr-12 pl-4 text-sm focus:outline-none focus:border-brand-red placeholder-gray-400 shadow-2xl ring-1 ring-white/10"
                        />
                        <button type="button" onClick={() => toggleSearch(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-white/10 rounded-full p-1 transition-colors">
                            <FaTimes size={14} />
                        </button>
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red" />
                    </div>
                </form>
            ) : (
                <button onClick={() => toggleSearch(true)} className="text-gray-400 hover:text-white cursor-pointer transition hover:scale-110 p-1">
                    <FaSearch className="text-lg" />
                </button>
            )}
        </div>
    );
}
