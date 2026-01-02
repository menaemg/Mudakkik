import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  User,
  TrendingUp,
  Check,
  X,
  Clock,
  ClipboardList,
  Tv,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AdsViewModal from "./Partials/AdsViewModal";
import AdminPagination from "@/Layouts/AdminPagination";
import { usePage, router } from "@inertiajs/react";
import AdsTable from "./Partials/AdsTable";
import AdsChart from "./Partials/AdsChart";

export default function join({ filters = {} }) {
  const [selectedStatus, setSelectedStatus] = useState(
    filters?.status || "all"
  );
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { requests, stats: state, oldPendingCount } = usePage().props;

  useEffect(() => {
    if (oldPendingCount > 0) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"}
                bg-gradient-to-br from-yellow-50 to-orange-50
                border border-yellow-200 rounded-xl shadow-lg p-4`}
        >
          <div className="flex gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold">تنبيه</h4>
              <p className="text-sm">
                لديك{" "}
                <span className="font-bold text-yellow-700">
                  {oldPendingCount} اعلانات
                </span>{" "}
                تنتظر المراجعة لأكثر من 3 أيام
              </p>
            </div>
          </div>
        </div>
      ));
    }
  }, [oldPendingCount]);

  // console.log(stats);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (
        searchTerm !== (filters?.search || "") ||
        selectedStatus !== (filters?.status || "all")
      ) {
        router.get(
          route("admin.requests.ads"),
          { search: searchTerm, status: selectedStatus, page: 1 },
          { preserveState: true, replace: true, preserveScroll: true }
        );
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedStatus, filters.search, filters.status]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "approved":
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
      case "approved":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      case "waiting_payment":
        return "في انتظار الدفع";
      default:
        return status;
    }
  };

  const handleApprove = (request, adminNote) => {
    router.patch(
      route("admin.requests.ads.update", request.id),
      {
        status: "approved",
        admin_notes: adminNote,
      },
      {
        onSuccess: () => {
          toast.success("تم قبول الطلب بنجاح");
          setSelectedRequest(null);
        },
        onError: () => {
          toast.error("حدث خطأ أثناء قبول الطلب");
        },
      }
    );
  };

  const handleReject = (request, adminNote) => {
    router.patch(
      route("admin.requests.ads.update", request.id),
      {
        status: "rejected",
        admin_notes: adminNote,
      },
      {
        onSuccess: () => {
          toast.success("تم رفض الطلب بنجاح");
          setSelectedRequest(null);
        },
        onError: () => {
          toast.error("حدث خطأ أثناء رفض الطلب");
        },
      }
    );
  };

  // console.log(requests);

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
        duration={10000}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">إدارة طلبات الاعلانات</h1>
          <p className="text-blue-200">
            {" "}
            مراجعة والموافقة على الإعلانات المقدمة{" "}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div
          className="
        grid grid-cols-1 md:grid-cols-3 gap-6 mb-6
        "
        >
          {/* Stats */}
          <motion.div
            whileHover={{ y: -10 }}
            className="
            md:col-span-1 flex bg-gradient-to-br
            from-[#001246] via-[#001b66] to-[#002a80]
            rounded-[2.5rem] shadow-2xl shadow-blue-900/30
         text-white relative overflow-hidden group
            cursor-pointer
            "
          >
            <div
              className="
                  rounded-3xl
                  p-6
                  flex flex-row md:flex-col
                  justify-between
                  relative
                  w-full
                  text-center
                  "
            >
              <div
                className="
                flex items-center gap-4
                flex-col md:flex-row
                text-center md:text-rightl"
              >
                <div className="p-3 rounded-xl">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-white/40 text-sm mb-1">
                  {" "}
                  عدد الإعلانات المسجلة بالنظام
                </p>
              </div>
              <p
                className="
                text-4xl md:text-5xl lg:text-6xl
                font-black tracking-tighter italic
                text-center
                md:absolute md:left-0 md:right-0 md:top-1/2 md:-translate-y-1/2"
                style={{ alignSelf: "center" }}
              >
                {state.total || 0}
              </p>
            </div>
            <Tv
              size={80}
              className="absolute -bottom-4 -left-4 text-white/5 -rotate-10 transition-transform group-hover:scale-110"
            />
          </motion.div>

          {/* Chart */}
          <div className="lg:col-span-2 md:col-span-2 ">
            {/* chart card here */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 ">
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-black text-gray-800 text-sm">
                    توزيع حالات الطلبات
                  </h3>
                </div>
              </div>

              {/* Chart */}
              <div className="relative flex-1 min-h-[260px] ">
                <AdsChart state={state} />
              </div>
            </div>
          </div>
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
                    placeholder="ابحث بالاسم أو البريد الإلكتروني او العنوان..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    className="
                                    px-10 py-2
                                    border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-[#001b66] focus:border-transparent
                                    appearance-none
                                    text-center
                                    w-full"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">جميع الحالات</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="approved">مقبول</option>
                    <option value="rejected">مرفوض</option>
                    <option value="waiting_payment">في انتظار الدفع</option>
                  </select>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
              {/* <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"> */}
              <AdsTable
                requests={requests.data}
                onView={(req) => setSelectedRequest(req)}
                onApprove={(req) => handleApprove(req)}
                onReject={(req) => handleReject(req)}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
              {/* </div> */}
              <AdminPagination
                links={requests.links}
                total={requests.total}
                label="إجمالي الإعلانات"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <AdsViewModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

join.layout = (page) => <AdminLayout children={page} />;
