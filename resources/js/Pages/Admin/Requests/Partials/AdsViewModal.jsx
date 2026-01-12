import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DetailRow, ActionButton, InfoCard } from "./Actions";
import {
  X,
  Mail,
  Calendar,
  FileText,
  Link2,
  CalendarPlus,
  CalendarX2,
  Image,
  PenSquareIcon,
  ScanEye,
  CalendarCheck,
} from "lucide-react";

export default function AdsViewModal({
  isOpen,
  request,
  onClose,
  getStatusColor,
  getStatusText,
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
            className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] flex flex-col  shadow-2xl "
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-[#001246] text-white p-8  relative  rounded-t-[3rem]">
              <button
                onClick={onClose}
                className="absolute top-6 left-6 text-white/40 hover:text-white"
              >
                <X size={28} />
              </button>

              <h2 className="text-2xl font-black mb-2">تفاصيل الإعلان</h2>

              <span
                className={`inline-block mt-2 px-4 py-1 rounded-xl text-xs font-black border ${getStatusColor(
                  request.status
                )}`}
              >
                {getStatusText(request.status)}
              </span>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 overflow-y-auto scrollbar flex-1">
              {/* Basic Info */}
              <InfoCard title="البيانات الأساسية">
                <DetailRow label="الاسم" value={request.user.name} />
                <DetailRow
                  label="البريد الإلكتروني"
                  value={request.user.email}
                  icon={<Mail size={14} />}
                />
                <DetailRow
                  label="تاريخ التقديم"
                  value={new Date(request.created_at).toLocaleDateString(
                    "ar-EG"
                  )}
                  icon={<Calendar size={14} />}
                />
                <DetailRow
                  label="المدة المطلوبة (بالأيام)"
                  labelColor="text-red-600"
                  valueColor="text-red-600"
                  value={request.number_of_days}
                  icon={<CalendarX2 size={14} />}
                />
                <DetailRow
                  label="تاريخ بدء الإعلان"
                  labelColor="text-green-600"
                  valueColor="text-green-600"
                  value={
                    request.start_date
                      ? new Date(request.start_date).toLocaleDateString("ar-EG")
                      : "لم يتم تحديد تاريخ بدء الإعلان"
                  }
                  icon={<CalendarCheck size={14} />}
                />
                <DetailRow
                  label="تاريخ نهاية الإعلان"
                  labelColor="text-orange-600"
                  valueColor="text-orange-600"
                  value={
                    request.end_date
                      ? new Date(request.end_date).toLocaleDateString("ar-EG")
                      : "لم يتم تحديد تاريخ نهاية الإعلان"
                  }
                  icon={<CalendarX2 size={14} />}
                />
              </InfoCard>

              {/* image */}
              <InfoCard
                title="صورة الإعلان (الصورة ستظهر في صفحة الإعلان)"
                icon={<Image size={14} />}
              >
                <a href={`/storage/${request.image_url}`} target="_blank">
                  <img
                    src={`/storage/${request.image_url}`}
                    alt={request.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </a>
              </InfoCard>

              {/* Reason */}
              <InfoCard
                title="محتوى الإعلان (العنوان)"
                icon={<PenSquareIcon size={14} />}
              >
                <p className="text-[#001246] font-bold leading-relaxed bg-slate-50 p-5 rounded-[1.5rem] border">
                  {request.title}
                </p>
              </InfoCard>

              {/* target-url */}
              <InfoCard
                title="رابط الإعلان المستهدف"
                icon={<Link2 size={14} />}
              >
                <div className="space-y-3">
                  <a
                    rel="noopener noreferrer"
                    href={request.target_link}
                    className="block text-[#001246] font-bold hover:underline"
                    target="_blank"
                  >
                    <p className="fa fa-link">{request.target_link}</p>
                  </a>
                </div>
              </InfoCard>

              {/* ad final look */}
              <InfoCard
                title="المعاينة النهائية للإعلان"
                icon={<ScanEye size={14} />}
              >
                <a
                  href={request.target_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="border w-full h-48 border-slate-200 rounded-lg overflow-hidden shadow-sm bg-cover bg-center"
                    style={{
                      backgroundImage: `url(/storage/${request.image_url})`,
                    }}
                  >
                    <div className="bg-black/40 h-full flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-lg text-center font-black text-white">
                          {request.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </a>
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
