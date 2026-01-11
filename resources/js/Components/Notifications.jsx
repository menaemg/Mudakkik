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

            const interval = setInterval(fetchNotifications, 600000);
            return () => clearInterval(interval);
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

    const deleteNotification = (notificationId) => {
        axios.delete(`/notifications/${notificationId}`)
            .then(() => {
                setNotifications(prev => {
                    const deletedNotif = prev.find(n => n.id === notificationId);
                    if (deletedNotif && !deletedNotif.read_at) {
                        setUnreadCount(u => Math.max(0, u - 1));
                    }
                    return prev.filter(n => n.id !== notificationId);
                });
            })
            .catch(err => {
                console.error("Error deleting notification:", err);
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
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-red rounded-full
                    shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse border border-[#000a2e]"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 left-0 w-80 bg-[#000a2e] border border-white/10 rounded-lg shadow-2xl
                overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h4 className="font-bold text-white text-xs">التنبيهات</h4>
                        <button onClick={markAsRead} className="text-[10px] text-brand-red cursor-pointer
                        hover:underline bg-transparent border-0 p-0 font-bold">
                            تحديد الكل كمقروء
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`relative p-4 border-b border-white/5 hover:bg-white/5
                                      transition-colors text-right group ${!n.read_at ? 'bg-white/[0.03]' : ''}`}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(n.id);
                                        }}
                                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 text-gray-400
                                        hover:text-red-400 transition-opacity p-1 rounded-full hover:bg-white/10"
                                        title="حذف الإشعار"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <Link
                                        href={n.data.url || '#'}
                                        onClick={() => setIsOpen(false)}
                                        className="block pr-6"
                                    >
                                        <p className="text-xs text-white leading-relaxed">{n.data?.message || 'إشعار'}</p>
                                        {n.data?.details && (
                                            <p className="text-[11px] text-yellow-400/90 mt-1.5 leading-relaxed">
                                                {n.data.details}
                                            </p>
                                        )}
                                        <span className="text-[10px] text-gray-500 mt-2 block">
                                            {new Date(n.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                                        </span>
                                    </Link>
                                </div>
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
