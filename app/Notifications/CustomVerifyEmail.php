<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('🎉 أهلاً بك في مدقق! - تأكيد البريد الإلكتروني')
            ->greeting("مرحباً {$notifiable->name}!")
            ->line('نحن سعداء جداً بانضمامك إلى مجتمع مدقق.')
            ->line('منصتنا تساعدك على التحقق من صحة الأخبار والمعلومات باستخدام الذكاء الاصطناعي.')
            ->line('')
            ->line('**يرجى تأكيد بريدك الإلكتروني للبدء:**')
            ->action('تأكيد البريد الإلكتروني', $verificationUrl)
            ->line('')
            ->line('**بعد التأكيد يمكنك:**')
            ->line('✅ استكشاف المنصة وابدأ بالتحقق من أول خبر')
            ->line('✅ اطلع على الباقات المتاحة للحصول على المزيد من المميزات')
            ->line('')
            ->line('إذا لم تقم بإنشاء حساب، لا حاجة لاتخاذ أي إجراء.')
            ->salutation('فريق مدقق');
    }

    /**
     * Get the verification URL for the given notifiable.
     */
    protected function verificationUrl(object $notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'verify_email',
            'message' => 'تم إرسال رابط تأكيد البريد الإلكتروني.',
        ];
    }
}
