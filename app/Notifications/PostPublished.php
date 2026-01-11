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
public function toMail($notifiable)
{
    $url = url('/profile?tab=articles'); 

    return (new MailMessage)
        ->subject('تهانينا! تم نشر مقالك بنجاح')
        ->greeting('مرحباً ' . $notifiable->name)
        ->line("يسعدنا إبلاغك أن مقالك: '" . $this->post->title . "' قد اجتاز مراجعة الذكاء الاصطناعي وتم نشره بنجاح.")
        ->action('عرض مقالاتي المنشورة', $url)
        ->line('شكراً لمساهمتك القيمة في منصتنا.')
        ->salutation('مع التحية، فريق العمل');
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
            'url' => url('/articles/' . $this->post->slug),
            'id' => $this->post->id
        ];
    }
}
