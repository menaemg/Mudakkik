import React, { useState, useEffect, useMemo } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  WholeWord,
  Users,
  CreditCard,
  Megaphone,
  Hash,
  Newspaper,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ShieldCheck,
  UserRoundCheck,
  Package,
  Layers,
  FolderTree,
  LogOut,
  Monitor,
  ScrollText,
  LayoutTemplate,
  House,
  Settings,
  ShieldAlert,
  MessageSquare,
  CreditCard as PaymentIcon,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { auth, admin, url, flash } = usePage().props;
  const currentUrl = url || window.location.pathname || "";
  const cleanUrl = currentUrl.split("?")[0];

  const pendingReports = admin?.pendingReportsCount || 0;
  const notifications = auth?.user?.notifications || [];
  const unreadCount = auth?.user?.unread_notifications_count || 0;

  const [displayUnreadCount, setDisplayUnreadCount] = useState(unreadCount);

  useEffect(() => {
    setDisplayUnreadCount(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      setDisplayUnreadCount(0);
      router.post(
        route("notifications.read"),
        {},
        {
          preserveScroll: true,
        }
      );
    }
  }, [showNotifications]);

  const handleMarkAllRead = () => {
    setDisplayUnreadCount(0);
    router.post(
      route("notifications.read"),
      {},
      {
        onSuccess: () => {
          setShowNotifications(false);
        },
        preserveScroll: true,
      }
    );
  };

  const menuItems = [
    { label: "الرئيسية", icon: LayoutDashboard, url: "/admin/dashboard" },
    {
      label: "إدارة المحتوى",
      icon: Newspaper,
      list: [
        { label: "المقالات", icon: Newspaper, url: "/admin/posts" },
        { label: "التدقيق الذكي", icon: ShieldCheck, url: "/admin/ai-audit" },
        { label: "الفئات", icon: FolderTree, url: "/admin/categories" },
        { label: "الأوسمة", icon: Hash, url: "/admin/tags" },
      ],
    },
    {
      label: "إدارة الواجهة",
      icon: Monitor,
      list: [
        { label: "شريط الأخبار", icon: ScrollText, url: "/admin/home/ticker" },
        { label: "الهيرو سكشن", icon: LayoutTemplate, url: "/admin/home/hero" },
        { label: "أخبار مميزة", icon: LayoutTemplate, url: "/admin/home/featured" },
        { label: "أهم قصص اليوم", icon: LayoutTemplate, url: "/admin/home/top-stories" },
        { label: "أهم المواضيع", icon: LayoutTemplate, url: "/admin/home/top-topics" },
        { label: "الفنون والترفيه", icon: LayoutTemplate, url: "/admin/home/entertainment" },
        { label: "مال واعمال ", icon: LayoutTemplate, url: "/admin/home/business" },
        { label: "قسم البانر", icon: LayoutTemplate, url: "/admin/home/banner" },
      ],
    },
    {
      label: "المستخدمين والطلبات",
      icon: Users,
      list: [
        { label: "قائمة المستخدمين", icon: Users, url: "/admin/users" },
        { label: "طلبات الانضمام", icon: UserRoundCheck, url: "/admin/requests/join" },
        { label: "إعلانات مدقق", icon: Megaphone, url: "/admin/requests/ads" },
        {
          label: "البلاغات",
          icon: ShieldAlert,
          url: "/admin/reports",
          badge: pendingReports,
        },
      ],
    },
    {
      label: "المالية والاشتراكات",
      icon: PaymentIcon,
      list: [
        { label: "الخطط", icon: Package, url: "/admin/plans" },
        { label: "الاشتراكات", icon: Layers, url: "/admin/subscriptions" },
        { label: "المدفوعات", icon: CreditCard, url: "/admin/payments" },
      ],
    },
    {
      label: "إعدادات النظام",
      icon: Settings,
      list: [
        { label: "سياسات المدقق", icon: ShieldCheck, url: "/admin/policies" },
        { label: "المواقع الموثوقة", icon: WholeWord, url: "/admin/trusted-domains" },
      ],
    },
  ];

  const activeData = useMemo(() => {
    for (const item of menuItems) {
      if (item.url === cleanUrl)
        return { parent: "لوحة التحكم", main: item.label, sub: null, parentLabel: item.label };
      if (item.list) {
        const foundSub = item.list.find((sub) => cleanUrl.startsWith(sub.url));
        if (foundSub)
          return { parent: "لوحة التحكم", main: item.label, sub: foundSub.label, parentLabel: item.label };
      }
    }
    return { parent: "لوحة التحكم", main: "الرئيسية", sub: null, parentLabel: null };
  }, [cleanUrl]);

  useEffect(() => {
    if (activeData.parentLabel) setOpenMenu(activeData.parentLabel);
  }, [activeData.parentLabel]);

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "تمت العملية بنجاح",
        text: flash.success,
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
    }
  }, [flash]);

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-right overflow-hidden" dir="rtl">
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#001246] text-white shadow-2xl lg:relative lg:translate-x-0 transition-transform duration-500 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} flex flex-col h-full`}>
        <div className="shrink-0 p-6 flex items-center justify-between bg-black/10 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center">
              <span className="text-white text-2xl font-black leading-none">م</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-black tracking-tight">مدقق<span className="text-red-600">.</span></span>
              <span className="text-[10px] font-bold text-slate-400 -mt-1 mr-1">نيوز</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
          {menuItems.map((item) => {
            const hasSub = !!item.list;
            const isMenuOpen = openMenu === item.label;
            const isAnyChildActive = hasSub && item.list.some((s) => cleanUrl.startsWith(s.url));

            return (
              <div key={item.label} className="mb-1">
                {hasSub ? (
                  <button
                    onClick={() => setOpenMenu(isMenuOpen ? null : item.label)}
                    className={`flex items-center justify-between w-full p-3.5 rounded-2xl transition-all duration-300 ${isMenuOpen || isAnyChildActive ? "bg-white/10 text-white shadow-inner" : "text-slate-400 hover:bg-white/5"}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isAnyChildActive ? "text-red-500" : "text-slate-400"} />
                      <span className="text-sm font-black">{item.label}</span>
                    </div>
                    <ChevronLeft size={16} className={`transition-transform duration-300 ${isMenuOpen ? "-rotate-90 text-red-500" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${cleanUrl === item.url ? "bg-red-600 text-white shadow-xl shadow-red-900/40" : "text-slate-400 hover:bg-white/5"}`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-black">{item.label}</span>
                  </Link>
                )}

                <AnimatePresence>
                  {hasSub && (isMenuOpen || isAnyChildActive) && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mr-4">
                      <div className="mt-2 border-r-2 border-white/5 space-y-1 pr-3">
                        {item.list.map((sub) => {
                          const isSubActive = cleanUrl.startsWith(sub.url);
                          return (
                            <Link
                              key={sub.url}
                              href={sub.url}
                              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${isSubActive ? "bg-red-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                            >
                              <div className="flex items-center gap-3">
                                <sub.icon size={16} className={isSubActive ? "text-white" : "text-slate-500"} />
                                <span className="text-xs font-bold">{sub.label}</span>
                              </div>
                              {sub.badge > 0 && (
                                <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full text-white font-black animate-pulse">{sub.badge}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-40 sticky top-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#001246] p-2 hover:bg-slate-100 rounded-2xl transition-all"><Menu size={30} /></button>
            <div className="hidden lg:block">
              <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400 mb-1">
                <span>{activeData.parent}</span>
                <ChevronLeft size={14} className="mt-0.5" />
                <span className={activeData.sub ? "text-slate-400" : "text-[#001246]"}>{activeData.main}</span>
                {activeData.sub && (
                  <><ChevronLeft size={14} className="mt-0.5" /><span className="text-red-500 font-black">{activeData.sub}</span></>
                )}
              </nav>
              <p className="text-xl font-black text-[#001246]">{activeData.sub || activeData.main}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all relative group"
              >
                <Bell size={24} className="text-[#001246] group-hover:rotate-12 transition-transform" />
                {displayUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {displayUnreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 z-40" />
                    <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="absolute left-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden">
                      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-black text-[#001246]">الإشعارات</span>
                        {displayUnreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-[11px] font-black text-blue-600 hover:underline">تحديد الكل كمقروء</button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <Link key={n.id} href={n.data.link} onClick={() => setShowNotifications(false)} className={`flex gap-4 p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read_at ? "bg-blue-50/20" : ""}`}>
                              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-red-500">
                                <MessageSquare size={18} />
                              </div>
                              <div className="flex flex-col min-w-0 text-right">
                                <p className="text-[12px] font-black text-[#001246] truncate">{n.data.title}</p>
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.data.message}</p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-12 text-center text-slate-400 font-bold">لا توجد إشعارات حالياً</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="hidden md:block text-right">
                <p className="text-[13px] font-black text-[#001246] mb-0.5">{auth?.user?.name}</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">المسؤول العام</p>
              </div>
              <Link href="/profile" className="relative group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 p-[2px] shadow-lg border-2 border-white overflow-hidden hover:scale-105 transition-all duration-300">
                  {auth?.user?.avatar ? (
                    <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">{auth?.user?.name?.charAt(0)}</div>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="p-3 text-slate-400 hover:text-[#001246] hover:bg-slate-50 rounded-2xl transition-all"><House size={22} /></Link>
              <Link href={route("logout")} method="post" as="button" className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><LogOut size={22} /></Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 bg-[#F8FAFF]">
          {children}
        </main>
      </div>
    </div>
  );
}

AdminLayout.layout = (page) => <AdminLayout children={page} />;