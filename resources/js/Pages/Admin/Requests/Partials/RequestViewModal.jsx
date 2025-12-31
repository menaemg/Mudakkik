import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Briefcase, Calendar, FileText, Info } from "lucide-react";

export default function RequestViewModal({
  isOpen,
  request,
  onClose,
  getStatusColor,
  getStatusText,
  onView,
  onApprove,
  onReject,
}) {
  // console.log(request);
  const [adminNote, setAdminNote] = useState(request?.admin_notes || "");

  return (
    <AnimatePresence>
      {isOpen && request && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001246]/70 backdrop-blur-lg ">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh]  overflow-y-auto no-scrollbar shadow-2xl border border-white/20"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-[#001246] text-white p-8 relative  rounded-t-[3rem]">
              <button
                onClick={onClose}
                className="absolute top-6 left-6 text-white/40 hover:text-white"
              >
                <X size={28} />
              </button>

              <h2 className="text-2xl font-black mb-2">تفاصيل طلب الانضمام</h2>

              <span
                className={`inline-block mt-2 px-4 py-1 rounded-xl text-xs font-black border ${getStatusColor(
                  request.status
                )}`}
              >
                {getStatusText(request.status)}
              </span>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <InfoCard title="البيانات الأساسية">
                <DetailRow label="الاسم" value={request.user.name} />
                <DetailRow
                  label="البريد الإلكتروني"
                  value={request.user.email}
                  icon={<Mail size={14} />}
                />
                <DetailRow
                  label="التخصص"
                  value={request.user.bio}
                  icon={<Briefcase size={14} />}
                />
                <DetailRow
                  label="تاريخ التقديم"
                  value={request.created_at}
                  icon={<Calendar size={14} />}
                />
              </InfoCard>

              {/* Reason */}
              <InfoCard title="سبب الانضمام" icon={<Info size={14} />}>
                <p className="text-[#001246] font-bold leading-relaxed bg-slate-50 p-5 rounded-[1.5rem] border">
                  {request.request_message}
                </p>
              </InfoCard>

              {/* Attachments */}
              <InfoCard title="ملفات مرفقه" icon={<FileText size={14} />}>
                <div className="space-y-3">
                  <a
                    href={request.documents}
                    className="block text-blue-700 font-bold hover:underline"
                    target="_blank"
                  >
                    📄 ملف الطلب
                  </a>
                </div>
              </InfoCard>

              {/* admin note */}

              <InfoCard title="ملاحظة الإدارة" icon={<FileText size={14} />}>
                {" "}
                {request.status === "pending" ? (
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="تكتب ملاحظتك هنا..."
                    rows={4}
                    className="
                                        w-full
                                        text-sm font-bold text-[#001246]
                                        bg-slate-50
                                        border border-slate-200
                                        rounded-[1.5rem]
                                        p-4
                                        focus:outline-none
                                        focus:ring-2 focus:ring-[#001246]/20
                                        resize-none
                                    "
                  />
                ) : (
                  <p className="text-[#001246] font-bold leading-relaxed bg-slate-50 p-5 rounded-[1.5rem] border">
                    {request.admin_notes
                      ? request.admin_notes
                      : "لا توجد ملاحظات من الإدارة."}
                  </p>
                )}
              </InfoCard>

              {/* Actions */}
              {request.status === "pending" && (
                <div className="flex gap-4 pt-6 border-t">
                  <ActionButton
                    color="green"
                    text="قبول الطلب"
                    onClick={() => onApprove(request, adminNote)}
                  />
                  <ActionButton
                    color="red"
                    text="رفض الطلب"
                    onClick={() => onReject(request, adminNote)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
    <h4 className="text-xs font-black text-slate-400 mb-4 flex items-center gap-2">
      {icon} {title}
    </h4>
    {children}
  </div>
);

const DetailRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center text-sm font-black py-1">
    <span className="text-slate-400 flex items-center gap-1">
      {icon} {label}
    </span>
    <span className="text-[#001246]">{value}</span>
  </div>
);

const ActionButton = ({ color, text, onClick }) => {
  const colors = {
    green: "bg-emerald-600 active:bg-emerald-800 hover:bg-emerald-700",
    red: "bg-red-600 active:bg-red-800 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-white font-black rounded-[1.5rem] shadow-lg transition-all active:scale-95 ${colors[color]}`}
    >
      {text}
    </button>
  );
};
