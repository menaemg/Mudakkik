import { Link } from "@inertiajs/react";
import { LayoutDashboard, Users, CreditCard, Megaphone } from "lucide-react";

export default function Dashboard() {
    const menuItems = [
        { label: "الرئيسية", icon: LayoutDashboard, url: "/admin/dashboard", color: "text-blue-500" },
        { label: "طلبات الترقية", icon: Users, url: "/admin/upgrades", color: "text-purple-500" },
        { label: "الإعلانات", icon: Megaphone, url: "/admin/ads", color: "text-orange-500" },
        { label: "المدفوعات", icon: CreditCard, url: "/admin/payments", color: "text-green-500" },
    ];

    return (
        <div className="flex h-screen bg-slate-50/50" dir="rtl"> {/* أضفت dir="rtl" لتنسيق اللغة العربية */}
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l shadow-sm">
                <div className="p-6 text-xl font-bold text-center border-b">
                    لوحة الإدارة
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-all group"
                        >
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                            <span className="font-medium text-slate-700">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* هنا تضعين محتوى الصفحة بدلاً من كلمة children */}
                <h1 className="text-3xl font-bold text-slate-800 mb-8">مرحباً بكِ في لوحة التحكم 👋</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* مثال لكروت الإحصائيات الملونة */}
                    <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg">
                        <h3 className="text-lg opacity-80">إجمالي المستخدمين</h3>
                        <p className="text-4xl font-bold mt-2">1,250</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg">
                        <h3 className="text-lg opacity-80">طلبات الترقية</h3>
                        <p className="text-4xl font-bold mt-2">15</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg">
                        <h3 className="text-lg opacity-80">الأرباح اليومية</h3>
                        <p className="text-4xl font-bold mt-2">$450</p>
                    </div>
                </div>
            </main>
        </div>
    );
}