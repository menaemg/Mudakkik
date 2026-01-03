<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostReport;
use Illuminate\Http\Request;
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
        $report->update([
            'status' => 'approved'
        ]);

        // رفض البوست نفسه
        $report->post->update([
            'status' => 'rejected'
        ]);

        return back();
    }

    public function reject(PostReport $report)
    {
        $report->update([
            'status' => 'rejected'
        ]);

        return back();
    }
}
