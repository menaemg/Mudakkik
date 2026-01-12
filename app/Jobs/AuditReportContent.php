<?php

namespace App\Jobs;

use App\Models\PostReport;
use App\Models\User;
use App\Services\AiAuditService;
use App\Notifications\ReportApproved;
use App\Notifications\ReportRejected;
use App\Notifications\ReportPendingReview;
use App\Notifications\PostHiddenByReport;
use App\Notifications\AdminActivityNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuditReportContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public PostReport $report;

    public function __construct(PostReport $report)
    {
        $this->report = $report;
    }

    private function getDefaultErrorData(): array
    {
        return [
            'score' => 50,
            'verdict' => 'needs_review',
            'summary' => 'حدث خطأ في معالجة البيانات، بانتظار المراجعة اليدوية.',
        ];
    }

    public function handle(AiAuditService $aiService): void
    {
        Log::info("Job Started: Auditing Report #{$this->report->id}");

        try {
            // Load relationships
            $this->report->load(['post', 'user']);
            
            if (!$this->report->post) {
                Log::warning("Report #{$this->report->id} has no associated post");
                return;
            }

            $result = $aiService->auditReport(
                $this->report->reason,
                $this->report->post->body
            );

            $data = $result ?: $this->getDefaultErrorData();

            Log::info("AI Results for Report #{$this->report->id}", [
                'verdict' => $data['verdict'] ?? 'none',
                'score' => $data['score'] ?? 0,
            ]);

            // Update report with AI results
            $this->report->update([
                'ai_score' => $data['score'] ?? 50,
                'ai_summary' => $data['summary'] ?? '',
                'ai_verdict' => $data['verdict'] ?? 'needs_review',
            ]);

            // Take action based on verdict
            $this->processVerdict($data['verdict'] ?? 'needs_review');

        } catch (\Exception $e) {
            Log::error("Critical Job Failure for Report #{$this->report->id}: " . $e->getMessage());
            $this->report->update([
                'ai_verdict' => 'needs_review',
                'ai_summary' => 'حدث خطأ أثناء المراجعة الآلية.',
            ]);
        }
    }

    private function processVerdict(string $verdict): void
    {
        $reporter = $this->report->user;
        $postAuthor = $this->report->post?->user;

        switch ($verdict) {
            case 'valid':
                $this->approveReport($reporter, $postAuthor);
                break;

            case 'invalid':
                $this->rejectReport($reporter);
                break;

            case 'needs_review':
            default:
                $this->escalateToAdmin($reporter);
                break;
        }

        // Clear cached counts
        Cache::forget('admin.pending_reports_count');
    }

    private function approveReport(?User $reporter, ?User $postAuthor): void
    {
        DB::transaction(function () {
            $this->report->update(['status' => 'approved']);
            
            if ($this->report->post) {
                $this->report->post->update(['status' => 'rejected']);
            }
        });

        // Notify the reporter
        if ($reporter) {
            $reporter->notify(new ReportApproved($this->report));
            Log::info("Notification Sent: ReportApproved to user #{$reporter->id}");
        }

        // Notify the post author
        if ($postAuthor && $this->report->post) {
            $postAuthor->notify(new PostHiddenByReport(
                $this->report->post,
                $this->report->reason
            ));
            Log::info("Notification Sent: PostHiddenByReport to user #{$postAuthor->id}");
        }
    }

    private function rejectReport(?User $reporter): void
    {
        $this->report->update(['status' => 'rejected']);

        if ($reporter) {
            $reporter->notify(new ReportRejected($this->report));
            Log::info("Notification Sent: ReportRejected to user #{$reporter->id}");
        }
    }

    private function escalateToAdmin(?User $reporter): void
    {
        // Status remains 'pending'
        
        // Notify reporter
        if ($reporter) {
            $reporter->notify(new ReportPendingReview($this->report));
            Log::info("Notification Sent: ReportPendingReview to user #{$reporter->id}");
        }

        // Notify admins
        $admins = User::where('role', 'admin')->get();
        $notificationData = [
            'title' => 'بلاغ يحتاج مراجعة',
            'message' => 'بلاغ جديد يحتاج إلى مراجعة يدوية على المنشور: ' . ($this->report->post?->title ?? 'محذوف'),
            'link' => route('admin.reports.index'),
            'type' => 'report',
        ];

        foreach ($admins as $admin) {
            $admin->notify(new AdminActivityNotification($notificationData));
        }
        
        Log::info("Notification Sent: AdminActivityNotification to " . $admins->count() . " admins");
    }
}
