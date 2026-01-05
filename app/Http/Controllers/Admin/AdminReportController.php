<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index()
    {
        $reports = PostReport::with(['post', 'user'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports
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
            $report->update(['status' => 'approved']);
            return back()->with('warning', 'تمت الموافقة على البلاغ ولكن المنشور غير موجود.');
        }

        // Use database transaction for atomic updates
        DB::transaction(function () use ($report) {
            $report->update([
                'status' => 'approved'
            ]);

            // Reject/hide the post
            $report->post->update([
                'status' => 'rejected'
            ]);
        });

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
            'status' => 'rejected'
        ]);

        // Clear the cached pending reports count
        Cache::forget('admin.pending_reports_count');

        return back()->with('success', 'تم رفض البلاغ بنجاح.');
    }
}
