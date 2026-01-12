<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostReport;
use App\Notifications\ReportApproved;
use App\Notifications\ReportRejected;
use App\Notifications\PostHiddenByReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        
        $query = PostReport::with(['post', 'user', 'reviewedBy'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $reports = $query->get();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
            'currentStatus' => $status,
        ]);
    }

    public function approve(PostReport $report)
    {
        // Check if report is already processed
        if ($report->status !== 'pending') {
            return back()->with('error', 'هذا البلاغ تمت معالجته بالفعل.');
        }

        // Check if post exists before updating
        if (!$report->post) {
            $report->update([
                'status' => 'approved',
                'reviewed_by' => auth()->id(),
            ]);
            return back()->with('warning', 'تمت الموافقة على البلاغ ولكن المنشور غير موجود.');
        }

        // Use database transaction for atomic updates
        DB::transaction(function () use ($report) {
            $report->update([
                'status' => 'approved',
                'reviewed_by' => auth()->id(),
            ]);

            // Reject/hide the post
            $report->post->update([
                'status' => 'rejected'
            ]);
        });

        // Notify the reporter
        if ($report->user) {
            $report->user->notify(new ReportApproved($report));
        }

        // Notify the post author
        $postAuthor = $report->post->user;
        if ($postAuthor) {
            $postAuthor->notify(new PostHiddenByReport(
                $report->post,
                $report->reason
            ));
        }

        // Clear the cached pending reports count
        Cache::forget('admin.pending_reports_count');

        return back()->with('success', 'تمت الموافقة على البلاغ ورفض المنشور بنجاح.');
    }

    public function reject(PostReport $report)
    {
        // Check if report is already processed
        if ($report->status !== 'pending') {
            return back()->with('error', 'هذا البلاغ تمت معالجته بالفعل.');
        }

        $report->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
        ]);

        // Notify the reporter
        if ($report->user) {
            $report->user->notify(new ReportRejected($report));
        }

        // Clear the cached pending reports count
        Cache::forget('admin.pending_reports_count');

        return back()->with('success', 'تم رفض البلاغ بنجاح.');
    }
}
