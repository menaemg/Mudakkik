<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostPendingReview extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    public $post;
    public $notes;

    public function __construct($post, $notes)
    {
        $this->post = $post;
        $this->notes = $notes;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail($notifiable)
    {
        $url = url('/profile?tab=articles');

        return (new MailMessage)
            ->subject('مقالك قيد المراجعة: ' . \Illuminate\Support\Str::limit($this->post->title, 50))
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("تم استلام مقالك، وهو حالياً قيد المراجعة الإضافية لتحسين الجودة.")
            ->line('ملاحظات التدقيق: ' . ($this->post->ai_report ?: 'تعديلات بسيطة مطلوبة.'))
            ->action('متابعة حالة المقال', $url)
            ->line('سنقوم بإرسال إشعار فور انتهاء عملية المراجعة.')
            ->salutation('مع التحية، فريق العمل');
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'مقالك يحتاج لتعديلات لغوية ونحوية ليتم نشره.',
            'action_url' => url('/profile?tab=articles')
        ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'مقالك يحتاج لتعديلات لغوية ونحوية ليتم نشره.',
            'action_url' => url('/profile?tab=articles')
        ];
    }
}
