<?php

namespace App\Notifications;

use App\Models\PostReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ReportPendingReview extends Notification implements ShouldBroadcast
{
    use Queueable;

    public PostReport $report;

    public function __construct(PostReport $report)
    {
        $this->report = $report;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $postTitle = $this->report->post?->title ?? 'منشور محذوف';

        return (new MailMessage)
            ->subject('بلاغك قيد المراجعة')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("بلاغك على المنشور: \"" . Str::limit($postTitle, 50) . "\" قيد المراجعة من قبل فريق الإدارة.")
            ->line('سنخبرك بالنتيجة فور اتخاذ القرار.')
            ->salutation('مع التحية، فريق المدقق');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'بلاغك قيد المراجعة من قبل فريق الإدارة',
            'type' => 'info',
            'report_id' => $this->report->id,
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'بلاغك قيد المراجعة من قبل فريق الإدارة',
            'type' => 'info',
            'report_id' => $this->report->id,
        ];
    }
}
