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

class ReportApproved extends Notification implements ShouldQueue, ShouldBroadcast
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
            ->subject('تم قبول بلاغك')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('نشكرك على مساهمتك في الحفاظ على جودة المحتوى.')
            ->line("تم قبول بلاغك على المنشور: \"" . Str::limit($postTitle, 50) . "\"")
            ->line('تم اتخاذ الإجراء المناسب بشأن المحتوى المُبلغ عنه.')
            ->salutation('مع التحية، فريق المدقق');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'تم قبول بلاغك واتخاذ الإجراء المناسب',
            'type' => 'success',
            'report_id' => $this->report->id,
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'تم قبول بلاغك واتخاذ الإجراء المناسب',
            'type' => 'success',
            'report_id' => $this->report->id,
        ];
    }
}
