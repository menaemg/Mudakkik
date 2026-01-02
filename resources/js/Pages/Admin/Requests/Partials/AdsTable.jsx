import React from "react";
import { Eye, Check, X, Calendar, CalendarPlus, CalendarX } from "lucide-react";
import { ActionIcon } from "./Actions";

export default function RequestsTable({
  requests,
  onView,
  onApprove,
  onReject,
  getStatusColor,
  getStatusText,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="hidden lg:table w-full text-right border-collapse table-fixed">
        <thead>
          <tr className="bg-slate-50/80 text-[#001246] border-b border-slate-100">
            <th className="p-3 font-black text-sm uppercase">
              المعلن {/* //name */}
            </th>
            <th className="p-3 font-black text-sm uppercase">
              العنوان {/* //title */}
            </th>
            <th className="p-3 font-black text-sm uppercase">الصورة</th>
            <th className="p-3 font-black text-sm uppercase">
              {" "}
              تاريخ التقديم{" "}
            </th>
            <th className="p-3 font-black text-sm uppercase"> بداية </th>
            <th className="p-3 font-black text-sm uppercase"> نهاية </th>
            <th className="p-3 font-black text-sm uppercase"> الحالة </th>
            <th className="p-3 font-black text-sm text-center">الإجراءات</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {requests.total === 0 && (
            <tr>
              <td colSpan="8" className="p-6 text-center text-slate-400">
                لا توجد طلبات إعلانات
              </td>
            </tr>
          )}
          {requests.map((request) => (
            <tr
              key={request.id}
              className="hover:bg-slate-50/50 transition-all group"
            >
              {/* Applicant */}
              <td className="p-3">
                <div className="text-right">
                  <div className="text-[17px] font-black text-[#001246] group-hover:text-[#D00000] transition-colors">
                    {request.user?.name}
                  </div>
                  <div className="text-sm text-slate-500 font-bold break-all">
                    {request.user?.email}
                  </div>
                </div>
              </td>

              {/* title */}
              <td className="p-3">
                <span className="text-sm font-black text-slate-600">
                  {request.title}
                </span>
              </td>

              {/* image */}
              <td className="p-3">
                <img
                  src={request.image_path}
                  alt={request.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>

              {/* request date */}
              <td className="p-2 text-center">
                <div className="inline-flex items-center gap-2 text-sm font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Calendar size={14} className="text-[#D00000]" />
                  {new Date(request.created_at).toLocaleDateString("ar-EG")}
                </div>
              </td>

              {/* start date */}
              <td className="p-3">
                <div className="inline-flex items-center gap-2 text-sm font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <CalendarPlus size={14} className="text-green-900" />
                  {new Date(request.requested_start_date).toLocaleDateString(
                    "ar-EG"
                  )}
                </div>
              </td>

              {/* end date */}
              <td className="p-3">
                <div className="inline-flex items-center gap-2 text-sm font-black text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                  <CalendarX size={14} />
                  {new Date(request.requested_end_date).toLocaleDateString(
                    "ar-EG"
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`inline-block px-4 py-1 rounded-xl text-xs font-black border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {getStatusText(request.status)}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 text-center">
                <div className="flex flex-wrap justify-center items-center gap-3">
                  <ActionIcon
                    icon={<Eye size={18} />}
                    color="blue"
                    onClick={() => onView(request)}
                  />

                  {request.status === "pending" && (
                    <>
                      <ActionIcon
                        icon={<Check size={18} />}
                        color="green"
                        onClick={() => onApprove(request)}
                      />
                      <ActionIcon
                        icon={<X size={18} />}
                        color="red"
                        onClick={() => onReject(request)}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4 bg-[#F2F5F9] ">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl border shadow-sm flex flex-row-reverse "
          >
            {/* ads image */}
            <div className="w-1/3 h-72">
              <img
                src={request.image_path}
                alt={request.title}
                className="w-full h-full object-cover rounded-r-xl"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
              {/* ads Details */}
              <div className="w-2/3 p-4 space-y-3">
                <div>
                  <p className="font-black text-[#001246]">
                    {request.user?.name}
                  </p>
                  <p className="text-xs text-slate-500 break-all">
                    {request.user?.email}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold">العنوان:</span> {request.title}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold">تاريخ التقديم:</span>{" "}
                  {new Date(request.created_at).toLocaleDateString("ar-EG")}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-slate-600">
                      <span className="font-bold">بداية:</span>{" "}
                      {new Date(
                        request.requested_start_date
                      ).toLocaleDateString("ar-EG")}
                    </span>
                    <span className="text-sm text-slate-600">
                      <span className="font-bold">نهاية:</span>{" "}
                      {new Date(request.requested_end_date).toLocaleDateString(
                        "ar-EG"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div>
                <div className="flex items-center justify-between ">
                  <span
                    className={`px-3 py-1 text-xs rounded-xl font-black border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusText(request.status)}
                  </span>

                  <div className="flex gap-2">
                    <ActionIcon
                      icon={<Eye size={16} />}
                      color="blue"
                      onClick={() => onView(request)}
                    />
                    {request.status === "pending" && (
                      <>
                        <ActionIcon
                          icon={<Check size={16} />}
                          color="green"
                          onClick={() => onApprove(request)}
                        />
                        <ActionIcon
                          icon={<X size={16} />}
                          color="red"
                          onClick={() => onReject(request)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
