import React from "react";
import { Eye, Check, X, Calendar } from "lucide-react";

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
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            المتقدم {/* //name */}
                        </th>
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            التخصص {/* //bio */}
                        </th>
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            تاريخ التقديم
                        </th>
                        <th className="px-10 py-7 font-black text-sm uppercase">
                            الحالة
                        </th>
                        <th className="px-10 py-7 font-black text-sm text-center">
                            الإجراءات
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                    {requests.map((request) => (
                        <tr
                            key={request.id}
                            className="hover:bg-slate-50/50 transition-all group"
                        >
                            {/* Applicant */}
                            <td className="px-10 py-7">
                                <div className="text-right">
                                    <div className="text-[17px] font-black text-[#001246] group-hover:text-[#D00000] transition-colors">
                                        {request.user?.name}
                                    </div>
                                    <div className="text-sm text-slate-500 font-bold break-all">
                                        {request.user?.email}
                                    </div>
                                </div>
                            </td>

                            {/* Specialty */}
                            <td className="px-10 py-7">
                                <span className="text-sm font-black text-slate-600">
                                    {request.user?.bio}
                                </span>
                            </td>

                            {/* Date */}
                            <td className="px-10 py-7 text-center">
                                <div className="inline-flex items-center gap-2 text-sm font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Calendar
                                        size={14}
                                        className="text-[#D00000]"
                                    />
                                    {new Date(
                                        request.created_at
                                    ).toLocaleDateString("ar-EG")}
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-10 py-7">
                                <span
                                    className={`inline-block px-4 py-1 rounded-xl text-xs font-black border ${getStatusColor(
                                        request.status
                                    )}`}
                                >
                                    {getStatusText(request.status)}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-10 py-7 text-center">
                                <div className="flex justify-center items-center gap-3">
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
                                                onClick={() =>
                                                    onApprove(request)
                                                }
                                            />
                                            <ActionIcon
                                                icon={<X size={18} />}
                                                color="red"
                                                onClick={() =>
                                                    onReject(request)
                                                }
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
                        className="bg-white rounded-xl border p-4 space-y-3 shadow-sm"
                    >
                        <div>
                            <p className="font-black text-[#001246]">
                                {request.user?.name}
                            </p>
                            <p className="text-xs text-slate-500 break-all">
                                {request.user?.email}
                            </p>
                        </div>

                        <div className="text-sm text-slate-600">
                            <span className="font-bold">التخصص:</span>{" "}
                            {request.user?.bio}
                        </div>

                        <div className="flex items-center justify-between">
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
                ))}
            </div>
        </div>
    );
}

/* ========================
   Small Helper Component
======================== */

const ActionIcon = ({ icon, color, onClick }) => {
    const styles = {
        blue: "text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white",
        green: "text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white",
        red: "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white",
    };

    return (
        <button
            onClick={onClick}
            className={`p-3 rounded-[1rem] transition-all ${styles[color]}`}
        >
            {icon}
        </button>
    );
};
