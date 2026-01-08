import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, WholeWord, Users, CreditCard, Megaphone, Hash,
  Newspaper, Menu, X, Bell, ChevronLeft, Search, ShieldCheck,
  UserRoundCheck, Package, Layers, FolderTree, LogOut,
  Monitor, ScrollText, LayoutTemplate, House,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { auth, admin, flash, url: currentUrl } = usePage().props;
  const pendingReports = admin?.pendingReportsCount || 0;

  const menuItems = [
    { label: "الرئيسية", icon: LayoutDashboard, url: "/admin/dashboard" },
    { label: "المستخدمين", icon: Users, url: "/admin/users" },
    { label: "المقالات", icon: Newspaper, url: "/admin/posts" },
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
    { label: "البلاغات", icon: Bell, url: "/admin/reports", badge: pendingReports },
    {
      label: "طلبات",
      icon: ShieldCheck,
      list: [
        { label: "الانضمام للمجتمع", icon: UserRoundCheck, url: "/admin/requests/join" },
        { label: "إعلانات مدقق", icon: Megaphone, url: "/admin/requests/ads" },
      ],
    },
    { label: "الخطط", icon: Package, url: "/admin/plans" },
    { label: "الاشتراكات", icon: Layers, url: "/admin/subscriptions" },
    { label: "المدفوعات", icon: CreditCard, url: "/admin/payments" },
    { label: "الفئات", icon: FolderTree, url: "/admin/categories" },
    { label: "الأوسمة", icon: Hash, url: "/admin/tags" },
    { label: "المواقع الموثوقة", icon: WholeWord, url: "/admin/trusted-domains" },
  ];

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "تمت العمليه بنجاح",
        text: flash.success,
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
    }
  }, [flash]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-right overflow-hidden" dir="rtl">
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-72 bg-[#001246] text-white shadow-2xl
          lg:relative lg:translate-x-0 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col h-full
        `}
      >
        <div className="shrink-0 p-8 text-2xl font-black flex items-center gap-3 bg-black/10 border-b border-white/5">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg rotate-3">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <span className="text-xl font-serif">المـ<span className="text-red-500">دقق</span></span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden mr-auto p-1"><X size={24} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-4 pr-4">القائمة الرئيسية</p>

          {menuItems.map((item) => {
            const hasSubmenu = !!item.list;
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label} className="space-y-1">
                {hasSubmenu ? (
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${isOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isOpen ? "text-red-500" : "group-hover:text-red-500"} />
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    <ChevronLeft size={16} className={`transition-transform duration-300 ${isOpen ? "-rotate-90 text-red-500" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={item.url}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group hover:bg-white/5 text-slate-400 hover:text-white ${currentUrl === item.url ? 'bg-white/10 text-white' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="group-hover:text-red-500" />
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    {item.badge > 0 && <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </Link>
                )}

                <AnimatePresence>
                  {hasSubmenu && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pr-4"
                    >
                      <div className="mt-1 border-r border-white/10 space-y-1 pr-2">
                        {item.list.map((sub) => (
                          <Link
                            key={sub.url}
                            href={sub.url}
                            className="flex items-center gap-3 p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <sub.icon size={14} />
                            <span className="text-xs font-medium">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 p-6 bg-black/20 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-500">النظام متصل الآن</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#001246] p-2 hover:bg-slate-100 rounded-xl transition-all">
              <Menu size={28} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-4 py-2 gap-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all w-80 group">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="ابحث في النظام..." className="bg-transparent border-none text-sm outline-none w-full text-right" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-[#001246]">{auth?.user?.name}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-tighter">@{auth?.user?.username}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                {auth?.user?.name?.charAt(0)}
              </div>
            </div>
            <Link href="/" className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"><House size={20} /></Link>
            <Link href={route("logout")} method="post" as="button" className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"><LogOut size={20} /></Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F8FAFF]">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#001246]/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
