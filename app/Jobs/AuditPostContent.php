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

public function handle(AiAuditService $aiService)
{
    try {
        $result = $aiService->audit($this->post->body);

        if (!$result) {
            $data = [
                'score' => 0,
                'verdict' => 'pending',
                'verdict_type' => 'checking',
                'notes' => 'فشل الفحص الآلي، بانتظار المراجعة اليدوية.'
            ];
        } else {
            $data = json_decode($result, true);
        }

        $this->post->update([
            'ai_score'   => $data['score'] ?? 0,
            'ai_report'  => $data['notes'] ?? '',
            'ai_verdict' => $data['verdict_type'] ?? 'checking',
            'status'     => $data['verdict'] ?? 'pending', 
        ]);

        $user = $this->post->user;
        if ($user) {
            if ($this->post->status === 'published') {
                $user->notify(new PostPublished($this->post));
               
                
            } elseif ($this->post->status === 'rejected') {
                $user->notify(new PostRejected($this->post));
                
            } else {
                $user->notify(new PostPendingReview($this->post, $this->post->ai_report));
               
            }
        }

    } catch (\Exception $e) {
        \Log::error("Job Error: " . $e->getMessage());
        $this->post->update(['status' => 'pending']);
    }
}
}