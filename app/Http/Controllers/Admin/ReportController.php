<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostReport;
use Inertia\Inertia;

class ReportController extends Controller
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
        $report->update(['status' => 'approved']);

        // اختياري: تخفي البوست
        $report->post->update(['status' => 'hidden']);

        return back();
    }

    public function reject(PostReport $report)
    {
        $report->update(['status' => 'rejected']);

        return back();
    }
}
