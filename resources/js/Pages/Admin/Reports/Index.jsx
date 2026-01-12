import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        approved: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
        pending: 'قيد الانتظار',
        approved: 'مقبول',
        rejected: 'مرفوض',
    };

    return (
        <span className={`px-3 py-1 text-sm rounded-full border ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
};

const AiVerdictBadge = ({ verdict, score }) => {
    if (!verdict) return null;

    const styles = {
        valid: 'bg-green-50 text-green-700 border-green-200',
        invalid: 'bg-red-50 text-red-700 border-red-200',
        needs_review: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const labels = {
        valid: 'بلاغ صحيح',
        invalid: 'بلاغ غير صحيح',
        needs_review: 'يحتاج مراجعة',
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded border ${styles[verdict] || ''}`}>
                {labels[verdict] || verdict}
            </span>
            {score !== null && score !== undefined && (
                <span className="text-xs text-gray-500">
                    ({score}%)
                </span>
            )}
        </div>
    );
};

export default function Index({ reports, currentStatus }) {
    const [filter, setFilter] = useState(currentStatus || 'all');

    const handleFilterChange = (status) => {
        setFilter(status);
        router.get(route('admin.reports.index'), { status }, { preserveState: true });
    };

    const approveReport = (id) => {
        if (confirm('هل تريد قبول هذا البلاغ؟ سيتم إخفاء المنشور.')) {
            router.post(route('admin.reports.approve', id));
        }
    };

    const rejectReport = (id) => {
        if (confirm('هل تريد رفض هذا البلاغ؟')) {
            router.post(route('admin.reports.reject', id));
        }
    };

    const filterButtons = [
        { value: 'all', label: 'الكل' },
        { value: 'pending', label: 'قيد الانتظار' },
        { value: 'approved', label: 'مقبول' },
        { value: 'rejected', label: 'مرفوض' },
    ];

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">البلاغات</h1>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {filterButtons.map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => handleFilterChange(btn.value)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === btn.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {reports.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                            لا توجد بلاغات {filter !== 'all' ? `بحالة "${filterButtons.find(b => b.value === filter)?.label}"` : ''} 🎉
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {report.post?.title || 'منشور محذوف'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        تم الإبلاغ بواسطة: {report.user?.name || 'مستخدم محذوف'}
                                    </p>
                                </div>
                                <StatusBadge status={report.status} />
                            </div>

                            {/* Report Reason */}
                            <div className="mb-3 p-3 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600 font-medium mb-1">سبب البلاغ:</p>
                                <p className="text-gray-800">{report.reason}</p>
                            </div>

                            {/* AI Analysis Section */}
                            {report.ai_verdict && (
                                <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-blue-700 font-medium">تحليل الذكاء الاصطناعي:</p>
                                        <AiVerdictBadge verdict={report.ai_verdict} score={report.ai_score} />
                                    </div>
                                    {report.ai_summary && (
                                        <p className="text-sm text-gray-700">{report.ai_summary}</p>
                                    )}
                                </div>
                            )}

                            {/* Reviewed By */}
                            {report.reviewed_by && report.reviewed_by_user && (
                                <p className="text-xs text-gray-500 mb-3">
                                    تمت المراجعة بواسطة: {report.reviewed_by_user.name}
                                </p>
                            )}

                            {/* Action Buttons - Only for pending reports */}
                            {report.status === 'pending' && (
                                <div className="flex gap-3 pt-3 border-t">
                                    <button
                                        onClick={() => approveReport(report.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        قبول البلاغ
                                    </button>

                                    <button
                                        onClick={() => rejectReport(report.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        رفض البلاغ
                                    </button>

                                    {report.post && (
                                        <a
                                            href={route('admin.posts.show', report.post.id)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            عرض المنشور
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
