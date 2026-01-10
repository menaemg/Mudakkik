<?php

namespace App\Jobs;

use App\Models\Post;
use App\Services\AiAuditService;
use App\Notifications\PostPublished;
use App\Notifications\PostPendingReview;
use App\Notifications\PostRejected;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AuditPostContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    private function getDefaultErrorData()
    {
        return [
            'score' => 0,
            'verdict' => 'pending',
            'verdict_type' => 'checking',
            'notes' => 'حدث خطأ في معالجة البيانات، بانتظار المراجعة اليدوية.'
        ];
    }

 public function handle(AiAuditService $aiService)
{
    Log::info("Job Started: Auditing Post #{$this->post->id}");

    try {
        $result = $aiService->audit($this->post->body);

        $data = $result ?: $this->getDefaultErrorData();

        Log::info("AI Results for Post #{$this->post->id}", [
            'verdict' => $data['verdict'] ?? 'none',
            'type' => $data['verdict_type'] ?? 'none'
        ]);

     
        $this->post->update([
            'ai_score'   => $data['score'] ?? 0,
            'ai_report'  => $data['notes'] ?? '',
            'ai_verdict' => $data['verdict_type'] ?? 'checking',
            'status'     => $data['verdict'] ?? 'pending',
        ]);

        $user = $this->post->user;
        if ($user) {
            Log::info("Attempting to notify user #{$user->id} for status: {$this->post->status}");

            if ($this->post->status === 'published') {
                $user->notify(new PostPublished($this->post));
                Log::info("Notification Sent: PostPublished");
            } 
            elseif ($this->post->status === 'rejected') {
                $user->notify(new PostRejected($this->post));
                Log::info("Notification Sent: PostRejected");
            } 
            else {
                $user->notify(new PostPendingReview($this->post, $this->post->ai_report));
                Log::info("Notification Sent: PostPendingReview");
            }
        } else {
            Log::warning("No user found for Post #{$this->post->id}");
        }

    } catch (\Exception $e) {
        Log::error("Critical Job Failure: " . $e->getMessage());
        $this->post->update(['status' => 'pending']);
    }
}
}