<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessful extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Payment $payment
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
        $planName = $this->payment->subscription?->plan?->name ?? 'Premium';
        $amount = number_format((float) $this->payment->amount, 2);
        $currency = strtoupper($this->payment->currency ?? 'USD');

        return (new MailMessage)
            ->subject('✅ تم تأكيد الدفع بنجاح')
            ->greeting("مرحباً {$notifiable->name}!")
            ->line("تم تأكيد دفعتك بنجاح.")
            ->line("**الخطة:** {$planName}")
            ->line("**المبلغ:** {$amount} {$currency}")
            ->action('عرض اشتراكي', url('/my-subscription'))
            ->line('شكراً لاستخدامك منصتنا!');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_successful',
            'message' => '✅ تم تأكيد دفعتك بنجاح',
            'payment_id' => $this->payment->id,
            'amount' => $this->payment->amount,
            'currency' => $this->payment->currency,
        ];
    }
}
