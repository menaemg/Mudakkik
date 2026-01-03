import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ reports }) {

    const approveReport = (id) => {
        if (confirm('هل تريد قبول هذا البلاغ؟')) {
            router.post(route('admin.reports.approve', id));
        }
    };

    const rejectReport = (id) => {
        if (confirm('هل تريد رفض هذا البلاغ؟')) {
            router.post(route('admin.reports.reject', id));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    البلاغات
                </h1>

                {reports.length === 0 && (
                    <p className="text-gray-600">
                        لا توجد بلاغات قيد المراجعة 🎉
                    </p>
                )}

                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="border rounded p-4 mb-4 bg-white shadow"
                    >
                        <h2 className="font-semibold text-lg">
                            {report.post.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                            تم الإبلاغ بواسطة: {report.user.name}
                        </p>

                        <p className="mt-3">
                            <strong>سبب البلاغ:</strong> {report.reason}
                        </p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => approveReport(report.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                قبول البلاغ
                            </button>

                            <button
                                onClick={() => rejectReport(report.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                رفض البلاغ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
