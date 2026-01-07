<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class StalePaymentAlert extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Collection $stalePayments
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
        $count = $this->stalePayments->count();
        $paymentIds = $this->stalePayments->pluck('id')->join(', ');

        return (new MailMessage)
            ->subject("⚠️ Alert: {$count} Stale Pending Payment(s)")
            ->greeting('Payment Reconciliation Alert')
            ->line("There are {$count} payment(s) that have been pending for more than 2 hours.")
            ->line("Payment IDs: {$paymentIds}")
            ->line('This may indicate webhook issues or failed payment processing.')
            ->action('View Payments', url('/admin/payments'))
            ->line('Please investigate and resolve these pending payments.');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'stale_payment_alert',
            'message' => "⚠️ {$this->stalePayments->count()} payment(s) pending for >2 hours",
            'payment_ids' => $this->stalePayments->pluck('id')->toArray(),
            'count' => $this->stalePayments->count(),
        ];
    }
}
