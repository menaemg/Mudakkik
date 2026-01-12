<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class PostHiddenByReport extends Notification
{
    use Queueable;

    public Post $post;
    public string $reportReason;

    public function __construct(Post $post, string $reportReason)
    {
        $this->post = $post;
        $this->reportReason = $reportReason;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/profile?tab=articles');

        return (new MailMessage)
            ->subject('تم إخفاء منشورك: ' . Str::limit($this->post->title, 50))
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('نأسف لإبلاغك أنه تم إخفاء منشورك بسبب بلاغ مقدم من أحد المستخدمين.')
            ->line('عنوان المنشور: ' . $this->post->title)
            ->line('سبب البلاغ: ' . $this->reportReason)
            ->action('عرض مقالاتي', $url)
            ->line('إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم.')
            ->salutation('مع التحية، فريق المدقق');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'تم إخفاء منشورك: ' . $this->post->title,
            'details' => 'سبب البلاغ: ' . Str::limit($this->reportReason, 100),
            'type' => 'warning',
            'url' => url('/profile?tab=articles'),
        ];
    }
}
