<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;


class PostRejected extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $post;
    public $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct($post, $reason = null)
    {
        $this->post = $post;
        $this->reason = $reason;
    }

    /**
     * Get the rejection reason (custom reason or ai_report fallback).
     */
    private function getReason(): string
    {
        return $this->reason ?: $this->post->ai_report ?: 'لم يتم توفير سبب تفصيلي.';
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $url = url('/profile?tab=articles');

        return (new MailMessage)
            ->subject('تم رفض نشر مقالك: ' . Str::limit($this->post->title, 50))
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("نأسف لإبلاغك أن مقالك تم رفض نشره بسبب انتهاك سياسات المحتوى.")
            ->line('سبب الرفض: ' . $this->getReason())
            ->action('عرض مقالاتي وتعديلها', $url)
            ->line('يرجى الالتزام بمعايير النشر لضمان قبول مقالاتك القادمة.')
            ->salutation('مع خالص التحية، فريق المدقق');
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => "تم رفض نشر مقالك: " . $this->post->title,
            'details' => 'سبب الرفض: ' . $this->getReason(),
            'type' => 'warning',
            'url' => url('/profile?tab=articles')
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تم رفض نشر مقالك: " . $this->post->title,
            'details' => 'سبب الرفض: ' . $this->getReason(),
            'type' => 'warning',
            'url' => url('/profile?tab=articles')
        ];
    }
}
