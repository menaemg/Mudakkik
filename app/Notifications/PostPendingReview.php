<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostPendingReview extends Notification
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
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('مقالك قيد المراجعة: مطلوب بعض التعديلات')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line("شكراً لمشاركتك مقال بعنوان: '{$this->post->title}'.")
            ->line("لقد تمت مراجعة المقال أولياً، وهو الآن 'تحت المراجعة' لوجود بعض الملاحظات اللغوية والنحوية التي تحتاج لتعديلك.")
            ->line("إليك تقرير الأخطاء بالتفصيل:")
            ->line($this->notes)
            ->action('تعديل المقال الآن', url('/posts/' . $this->post->id . '/edit'))
            ->line('بمجرد قيامك بتصحيح هذه النقاط، سيتم إعادة فحص المقال ونشره فوراً على المنصة.')
            ->salutation('مع تحيات فريق التدقيق الذكي');
    }

    public function toArray($notifiable): array
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'مقالك يحتاج لتعديلات لغوية ونحوية ليتم نشره.',
            'action_url' => '/posts/' . $this->post->id . '/edit'
        ];
    }
}