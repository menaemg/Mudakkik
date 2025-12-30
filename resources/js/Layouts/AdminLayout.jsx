import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Megaphone,
    Menu,
    X,
    Bell,
    ChevronLeft,
    Search,
    ShieldCheck,
    UserCheck,
    UserRoundCheck,
    MonitorCheck,
    Hash,
    Package,
    Layers,
    FolderTree,
    LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const { auth } = usePage().props;

    const menuItems = [
        { label: "الرئيسية", icon: LayoutDashboard, url: "/admin/dashboard" },
        { label: "المستخدمين", icon: Users, url: "/admin/users" },
        {
            label: "طلبات ",
            icon: ShieldCheck,
            url: "/admin/requests",
            list: [
                {
                    label: "الانضمام لمجتمع الحصفيين",
                    icon: UserRoundCheck,
                    url: "/admin/requests/join",
                },
                {
                    label: "الاعلانات علي مدقق",
                    icon: Megaphone,
                    url: "/admin/requests/ads",
                },
            ],
        },
        { label: "الخطط", icon: Package, url: "/admin/plans" },
        { label: "الاشتراكات", icon: Layers, url: "/admin/subscriptions" },
        // { label: "طلبات الترقية", icon: ShieldCheck, url: "/admin/upgrades" },
        { label: "المدفوعات", icon: CreditCard, url: "/admin/payments" },
        { label: "الفئات", icon: FolderTree, url: "/admin/categories" },
        { label: "الأوسمة", icon: Hash, url: "/admin/tags" },
    ];

    return (
        <div
            className="flex h-screen bg-gradient-to-tr from-[#F1F5F9] via-[#F8FAFC] to-[#E2E8F0] font-sans text-right overflow-hidden"
            dir="rtl"
        >
            <aside
                className={`
                fixed inset-y-0 right-0 z-50 w-72 bg-gradient-to-b from-[#001246] via-[#001b66] to-[#000d33] text-white shadow-2xl lg:relative lg:translate-x-0 transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                flex flex-col
            `}
            >
                <div className="p-8 text-2xl font-black flex items-center gap-3 bg-black/20 backdrop-blur-xl border-b border-white/5">
                    <div className="bg-gradient-to-br from-[#D00000] to-[#FF4D4D] p-2 rounded-xl shadow-lg shadow-red-950/40 rotate-3">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <span className="tracking-tighter uppercase text-xl font-serif">
                        المـ<span className="text-[#FF4D4D]">دقق</span>
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white mr-auto hover:bg-white/10 p-1 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-6 space-y-3 mt-4 overflow-y-auto no-scrollbar">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4 mr-2">
                        القائمة الرئيسية
                    </p>
                    {menuItems.map((item) => {
                        const isOpen = openMenu === item.label;
                        return (
                            <div key={item.label}>
                                {item.list ? (
                                    <button
                                        onClick={() =>
                                            setOpenMenu(
                                                isOpen ? null : item.label
                                            )
                                        }
                                        className="flex items-center justify-between p-3.5 rounded-xl transition-all group hover:bg-white/5 text-slate-300 hover:text-white w-full"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                size={20}
                                                className="group-hover:text-[#FF4D4D] transition-colors"
                                            />
                                            <span className="font-bold text-sm tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronLeft
                                            size={14}
                                            className={`transition-transform duration-300 ${
                                                isOpen
                                                    ? "-rotate-90 text-[#FF4D4D]"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        key={item.url}
                                        href={item.url}
                                        className="flex items-center justify-between p-3.5 rounded-xl transition-all group hover:bg-white/5 text-slate-300 hover:text-white"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                size={20}
                                                className="group-hover:text-[#FF4D4D] transition-colors"
                                            />
                                            <span className="font-bold text-sm tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronLeft
                                            size={14}
                                            className="opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0"
                                        />
                                    </Link>
                                )}
                                {item.list && (
                                    <div
                                        className={`mr-6 overflow-hidden transition-all duration-500 ease-in-out scrollbar-hide
                                        ${
                                            isOpen
                                                ? "max-h-40 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }
                                    `}
                                    >
                                        {item.list?.map((subItem) => (
                                            <Link
                                                key={subItem.url}
                                                href={subItem.url}
                                                className="flex items-center gap-3 p-2 rounded-lg transition-all group text-slate-400 hover:text-white hover:bg-white/5"
                                            >
                                                <subItem.icon
                                                    size={16}
                                                    className="group-hover:text-[#FF4D4D] transition-colors"
                                                />
                                                <span className="text-sm">
                                                    {subItem.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="flex-1"></div>

                <div className="p-6 bg-black/20 border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-500">
                            النظام متصل الآن
                        </span>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="bg-white/70 backdrop-blur-md h-20 border-b border-slate-200/60 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-[#001246] p-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <Menu size={28} />
                        </button>

                        <div className="hidden md:flex items-center bg-slate-100/80 rounded-2xl px-4 py-2.5 gap-3 border border-slate-200/50 focus-within:border-[#001246] focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-900/5 transition-all w-80 group">
                            <Search
                                size={18}
                                className="text-slate-400 group-focus-within:text-[#001246]"
                            />
                            <input
                                type="text"
                                placeholder="ابحث في نظام المـدقق..."
                                className="bg-transparent border-none text-sm outline-none w-full text-right font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="relative p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:text-[#D00000] transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#D00000] border-2 border-white rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-black text-[#001246]">
                                    {auth?.user?.name || "مستخدم"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-tighter">
                                    @{auth?.user?.username || "user"}
                                </p>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#001246] to-[#0055ff] flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/20 border-2 border-white ring-1 ring-slate-100">
                                {auth?.user?.name?.charAt(0) || "م"}
                            </div>
                        </div>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="p-2.5 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition-colors"
                            title="تسجيل الخروج"
                        >
                            <LogOut size={20} />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F8FAFF]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-[#001246]/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
