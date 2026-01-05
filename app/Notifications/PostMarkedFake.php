<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostMarkedFake extends Notification
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
            ->subject('تحذير: تم تصنيف مقالك كمحتوى مضلل')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("نأسف لإبلاغك أن مقالك: '{$this->post->title}' تم تصنيفه كمحتوى مضلل من قبل نظام الذكاء الاصطناعي.")
            ->line('سيتم إخفاء المقال من المنصة العامة حتى مراجعته.')
            ->line('إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا لمراجعة القرار.')
            ->action('تواصل معنا', url('/contact'))
            ->line('شكراً لتفهمك.')
            ->salutation('مع خالص التحية، فريق الموقع');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تحذير: تم تصنيف مقالك كمحتوى مضلل: " . $this->post->title,
            'type' => 'danger',
            'url' => url('/contact')
        ];
    }
}
