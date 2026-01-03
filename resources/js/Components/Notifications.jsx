import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Notifications({ user }) {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(auth.user?.notifications || []);
    const [unreadCount, setUnreadCount] = useState(auth.user?.unread_notifications_count || 0);
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
            .catch(err => {
              console.error("Error fetching notifications:", err)
            });
    };

    const markAsRead = () => {
        if (unreadCount === 0) return;
        axios.post('/notifications/mark-all-read')
          .then(() => {
              setUnreadCount(0);
              setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
          })
          .catch(err => {
              console.error("Error marking notifications as read:", err);
          });
    };

    if (!user) return null;

    return (
        <div className="relative" ref={notifRef}>
            <button
                onClick={() => { setIsOpen(!isOpen); if (!isOpen && unreadCount > 0) markAsRead(); }}
                className="relative p-2 text-gray-300 hover:text-white transition-all focus:outline-none group"
            >
                <FaBell className={`text-lg transition-transform ${unreadCount > 0 ? 'group-hover:rotate-12' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-red rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse border border-[#000a2e]"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 left-0 w-80 bg-[#000a2e] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h4 className="font-bold text-white text-xs">التنبيهات</h4>
                        <button onClick={markAsRead} className="text-[10px] text-brand-red cursor-pointer hover:underline bg-transparent border-0 p-0 font-bold">
                            تحديد الكل كمقروء
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <Link
                                    key={n.id}
                                    href={n.data.url || '#'}
                                    onClick={() => setIsOpen(false)}
                                    className={`block p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-right group ${!n.read_at ? 'bg-white/[0.03]' : ''}`}
                                >
                                        <p className="text-xs text-gray-700 leading-relaxed">{n.data?.message || 'إشعار'}</p>                                    <span className="text-[10px] text-gray-500 mt-2 block">
                                        {new Date(n.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <FaBell className="mx-auto mb-3 text-2xl opacity-10" />
                                <p className="text-xs">لا توجد إشعارات حالياً</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
