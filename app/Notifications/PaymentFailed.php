<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailed extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Payment $payment,
        public readonly ?string $reason = null
    ) {}

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
        $planName = $this->payment->subscription?->plan?->name ?? 'الخطة المدفوعة';

        return (new MailMessage)
            ->subject('❌ فشل عملية الدفع')
            ->greeting("مرحباً {$notifiable->name}")
            ->line('للأسف، لم تتم عملية الدفع بنجاح.')
            ->line("**الخطة:** {$planName}")
            ->when($this->reason, fn($mail) => $mail->line("**السبب:** {$this->reason}"))
            ->action('إعادة المحاولة', url('/plans'))
            ->line('إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_failed',
            'message' => '❌ فشل عملية الدفع',
            'payment_id' => $this->payment->id,
            'reason' => $this->reason,
        ];
    }
}
