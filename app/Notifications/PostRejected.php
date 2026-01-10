<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostRejected extends Notification
{
    public $post;

    /**
     * Create a new notification instance.
     */
    public function __construct($post)
    {
        $this->post = $post;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('تم رفض نشر مقالك: ' . $this->post->title)
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("نأسف لإبلاغك أن مقالك تم رفض نشره بسبب انتهاك سياسات المحتوى.")
            ->line('سبب الرفض: ' . $this->post->ai_report)
            ->action('تعديل المقال وإعادة المحاولة', route('posts.edit', $this->post->id))
            ->line('يرجى الالتزام بمعايير النشر لضمان قبول مقالاتك القادمة.')
            ->salutation('مع خالص التحية، فريق المدقق');
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
            'type' => 'warning',
            'url' => url('/my-posts/' . $this->post->id . '/edit')
        ];
    }
}
