<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class PostDeleted extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $postTitle;

    public function __construct($postTitle)
    {
        $this->postTitle = $postTitle;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => "تنبيه: قام المسؤول بحذف مقالك: '{$this->postTitle}' لمخالفته الشروط.",
            'type' => 'danger',
            'url' => null
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تنبيه: قام المسؤول بحذف مقالك: '{$this->postTitle}' لمخالفته الشروط.",
            'type' => 'danger',
            'url' => null
        ];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('تم حذف مقالك من الموقع')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("نأسف لإبلاغك أن مقالك '{$this->postTitle}' تم حذفه من الموقع لمخالفته الشروط والأحكام.")
            ->line('إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا لمراجعة القرار.')
            ->action('تواصل معنا', url('/contact'))
            ->line('شكراً لتفهمك.')
            ->salutation('مع خالص التحية، فريق الموقع');
    }
}
