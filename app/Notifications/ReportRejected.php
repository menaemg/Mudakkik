<?php

namespace App\Notifications;

use App\Models\PostReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ReportRejected extends Notification implements ShouldQueue, ShouldBroadcast
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
            ->subject('نتيجة مراجعة بلاغك')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('شكراً لتواصلك معنا.')
            ->line("بعد مراجعة بلاغك على المنشور: \"" . Str::limit($postTitle, 50) . "\"")
            ->line('تبين أن المحتوى لا يخالف سياسات المنصة.')
            ->line($this->report->ai_summary ? 'ملاحظات المراجعة: ' . $this->report->ai_summary : '')
            ->salutation('مع التحية، فريق المدقق');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'تم رفض بلاغك بعد المراجعة',
            'type' => 'info',
            'report_id' => $this->report->id,
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'تم رفض بلاغك بعد المراجعة',
            'type' => 'info',
            'report_id' => $this->report->id,
        ];
    }
}
