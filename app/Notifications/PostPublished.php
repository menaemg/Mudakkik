<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostPublished extends Notification
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
            ->greeting('مبروك!')
            ->line("تم نشر مقالك: '{$this->post->title}'")
            ->action('عرض المقال', url('/posts/' . $this->post->slug))
            ->line('شكراً لمساهمتك في المنصة!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تم نشر مقالك الجديد: " . $this->post->title,
            'url' => url('/posts/' . $this->post->slug),
            'id' => $this->post->id
        ];
    }
}
