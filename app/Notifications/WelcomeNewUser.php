<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNewUser extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
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
            ->subject('🎉 أهلاً بك في مدقق!')
            ->greeting("مرحباً {$notifiable->name}!")
            ->line('نحن سعداء جداً بانضمامك إلى مجتمع مدقق.')
            ->line('منصتنا تساعدك على التحقق من صحة الأخبار والمعلومات باستخدام الذكاء الاصطناعي.')
            ->line('**ماذا يمكنك فعله الآن؟**')
            ->line('✅ تحقق من بريدك الإلكتروني لتفعيل حسابك')
            ->line('✅ استكشف المنصة وابدأ بالتحقق من أول خبر')
            ->line('✅ اطلع على الباقات المتاحة للحصول على المزيد من المميزات')
            ->action('ابدأ الآن', url('/dashboard'))
            ->line('إذا كان لديك أي استفسار، لا تتردد في التواصل معنا!');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'welcome_new_user',
            'message' => '🎉 أهلاً بك في مدقق! نحن سعداء بانضمامك.',
        ];
    }
}
