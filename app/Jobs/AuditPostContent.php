<?php

namespace App\Jobs;

use App\Models\Post;
use App\Services\ContentReviewService;
use App\Notifications\PostPublished;
use App\Notifications\PostRejected;
use App\Notifications\PostMarkedFake;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Notifications\PostPendingReview;

class AuditPostContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $backoff = 30;

    public function __construct(
        public Post $post
    ) {}

    public function handle(ContentReviewService $reviewer): void
    {
        $audit = $reviewer->audit($this->post->body);
        $score = $audit['score'];
        $notes = $audit['notes'];
        $aiVerdict = $audit['verdict'];

        if ($aiVerdict === 'published' && $score >= 80) {
            $status = 'published';
            $notification = new PostPublished($this->post);
        } elseif ($score >= 50 && $score < 80) {
            $status = 'pending';
            $notification = new PostPendingReview($this->post, $notes);
        } else {
            $status = 'rejected';
            $notification = new PostRejected($this->post, $notes);
        }

        $this->post->update([
            'status' => $status,
            'ai_score' => $score,
            'ai_report' => $notes,
        ]);

        $this->post->user->notify($notification);
    }
    public function failed(\Throwable $exception): void
    {
        Log::error('فشل الـ Job الخاص بتدقيق المقال نهائياً', [
            'post_id' => $this->post->id,
            'error' => $exception->getMessage()
        ]);
    }
}
