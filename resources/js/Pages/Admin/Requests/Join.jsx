import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    UserPlus,
    Mail,
    Shield,
    Activity,
    Users,
    ShieldCheck,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Download,
    Check,
    X,
    Eye,
    Calendar,
    Clock,
    FileText,
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import RequestViewModal from "./Partials/RequestViewModal";
import RequestsTable from "./Partials/RequestsTable";
import AdminPagination from "@/Layouts/AdminPagination";

export default function join({ requests, filters }) {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const showPendingRequestsToast = () => {
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200
        rounded-xl shadow-lg p-4 flex gap-3`}
                >
                    <div className="flex items-start gap-3">
                        <div className="bg-yellow-400 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                                تنبيه
                            </h4>
                            <p className="text-sm text-gray-700">
                                لديك{" "}
                                <span className="font-bold text-yellow-700">
                                    8 طلبات
                                </span>{" "}
                                تنتظر المراجعة لأكثر من 3 أيام
                            </p>
                        </div>
                    </div>
                </div>
            ),
            { duration: 5000 }
        );
    };

    useEffect(() => {
        if (true) {
            // Replace 'true' with actual condition to check for pending requests
            showPendingRequestsToast();
        }
    }, []);

    const stats = [
        {
            label: "إجمالي الطلبات",
            value: "1,420",
            change: "+14.5%",
            icon: Users,
            color: "blue",
        },
        {
            label: "قيد المراجعة",
            value: "24",
            icon: Clock,
            color: "red",
            alert: true,
        },
        {
            label: "مقبول",
            value: "1,240",
            change: "+8.2%",
            icon: Check,
            color: "green",
        },
        { label: "مرفوض", value: "156", icon: X, color: "gray" },
    ];

    const requests = [
        {
            id: 1,
            name: "محمد أحمد علي",
            email: "mohamed@email.com",
            date: "2024-12-25",
            status: "pending",
            experience: "5 سنوات",
            specialty: "صحافة استقصائية",
        },
        {
            id: 2,
            name: "فاطمة حسن محمود",
            email: "fatma@email.com",
            date: "2024-12-24",
            status: "pending",
            experience: "3 سنوات",
            specialty: "صحافة رقمية",
        },
        {
            id: 3,
            name: "أحمد عبدالله",
            email: "ahmed@email.com",
            date: "2024-12-23",
            status: "pending",
            experience: "7 سنوات",
            specialty: "صحافة اقتصادية",
        },
        {
            id: 4,
            name: "سارة محمد",
            email: "sara@email.com",
            date: "2024-12-22",
            status: "accepted",
            experience: "4 سنوات",
            specialty: "صحافة سياسية",
        },
        {
            id: 5,
            name: "خالد إبراهيم",
            email: "khaled@email.com",
            date: "2024-12-21",
            status: "rejected",
            experience: "2 سنة",
            specialty: "صحافة رياضية",
        },
        {
            id: 6,
            name: "نور الهدى أحمد",
            email: "nour@email.com",
            date: "2024-12-20",
            status: "pending",
            experience: "6 سنوات",
            specialty: "صحافة ثقافية",
        },
    ];

    const recentActivities = [
        {
            action: "تم قبول",
            user: "سارة محمد",
            by: "أحمد أحمد",
            time: "منذ ساعتين",
        },
        {
            action: "تم رفض",
            user: "خالد إبراهيم",
            by: "أحمد أحمد",
            time: "منذ 3 ساعات",
        },
        {
            action: "طلب جديد",
            user: "محمد أحمد علي",
            by: "تلقائي",
            time: "منذ 5 ساعات",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "accepted":
                return "bg-green-100 text-green-700 border-green-300";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "قيد المراجعة";
            case "accepted":
                return "مقبول";
            case "rejected":
                return "مرفوض";
            default:
                return status;
        }
    };

    const filteredRequests = requests.filter((req) => {
        const matchesStatus =
            selectedStatus === "all" || req.status === selectedStatus;
        const matchesSearch =
            req.name.includes(searchTerm) || req.email.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Toaster
                position="top-right"
                reverseOrder={false}
                containerStyle={{
                    position: "fixed",
                    top: 50,
                    right: 30,
                }}
            />
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">
                        إدارة طلبات الانضمام
                    </h1>
                    <p className="text-blue-200">
                        عرض والتحكم في طلبات الانضمام لمجتمع الصحفيين
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`p-3 rounded-lg ${
                                            stat.color === "blue"
                                                ? "bg-blue-100"
                                                : stat.color === "red"
                                                ? "bg-red-100"
                                                : stat.color === "green"
                                                ? "bg-green-100"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 ${
                                                stat.color === "blue"
                                                    ? "text-blue-600"
                                                    : stat.color === "red"
                                                    ? "text-red-600"
                                                    : stat.color === "green"
                                                    ? "text-green-600"
                                                    : "text-gray-600"
                                            }`}
                                        />
                                    </div>
                                    {stat.alert && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            تحتاج مراجعة
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-gray-600 text-sm mb-1">
                                    {stat.label}
                                </h3>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    {stat.change && (
                                        <span className="text-green-600 text-sm flex items-center">
                                            <TrendingUp className="w-4 h-4 ml-1" />
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters and Search */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                >
                                    <option value="all">جميع الحالات</option>
                                    <option value="pending">
                                        قيد المراجعة
                                    </option>
                                    <option value="accepted">مقبول</option>
                                    <option value="rejected">مرفوض</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            <RequestsTable
                                requests={filteredRequests}
                                onView={(req) => setSelectedRequest(req)}
                                onApprove={(req) => handleApprove(req)}
                                onReject={(req) => handleReject(req)}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <RequestViewModal
                isOpen={!!selectedRequest}
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
            />
        </div>
    );
}

join.layout = (page) => <AdminLayout children={page} />;
