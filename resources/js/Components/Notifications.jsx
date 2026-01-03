import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

export default function Notifications({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // const interval = setInterval(fetchNotifications, 60000);
            // return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = () => {
        axios.get('/notifications')
            .then(res => {
                const notifs = res.data;
                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.read_at).length);
            })
            .catch(err => console.error("Error fetching notifications:", err));
    };

    const markAsRead = () => {
        axios.post('/notifications/mark-all-read')
            .then(() => {
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
            });
    };

    if (!user) return null;

    return (
        <div className="relative" ref={notifRef}>
            <button
                onClick={() => { setIsOpen(!isOpen); if (!isOpen && unreadCount > 0) markAsRead(); }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
            >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-10 left-0 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h4 className="font-bold text-gray-900 text-sm">الإشعارات</h4>
                        <button onClick={markAsRead} className="text-[10px] text-brand-blue cursor-pointer hover:underline bg-transparent border-0 p-0 font-bold">
                            تحديد الكل كمقروء
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read_at ? 'bg-blue-50/50' : ''}`}>

                                    <p className="text-xs text-gray-700 leading-relaxed">{n.data.message}</p>
                                    <span className="text-[9px] text-gray-400 mt-1 block">
                                        {new Date(n.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <FaBell className="mx-auto mb-2 text-xl opacity-20" />
                                <p className="text-xs">لا توجد إشعارات جديدة</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
