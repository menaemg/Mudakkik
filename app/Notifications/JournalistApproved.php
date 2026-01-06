<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JournalistApproved extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🎉 تهانينا! تمت ترقية حسابك إلى صحفي')
            ->greeting('مرحباً ' . $notifiable->name . '،')
            ->line('يسعدنا إبلاغك أنه تمت الموافقة على طلب انضمامك لفريق الصحفيين في منصة مدقق.')
            ->line('لقد حصلت على المميزات التالية:')
            ->line('✅ شارة التوثيق الصحفي.')
            ->line('✅ صلاحية نشر المقالات والأخبار.')
            ->line('🎁 هدية ترحيبية: 50 نقطة ذكاء اصطناعي إضافية لرصيدك الدائم.')
            ->action('ابدأ النشر الآن', url('/my-posts/create'))
            ->line('نتطلع لرؤية مساهماتك القيمة!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'مبارك! تم قبول طلبك وأصبحت صحفياً معتمداً. تم إضافة 50 نقطة لرصيدك 🎉',
            'url' => '/dashboard',
            'type' => 'success'
        ];
    }
}
