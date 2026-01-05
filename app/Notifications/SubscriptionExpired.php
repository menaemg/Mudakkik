<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpired extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Subscription $expiredSubscription,
        public readonly Subscription $newSubscription
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
        $expiredPlanName = $this->expiredSubscription->plan?->name ?? 'Premium';
        $newPlanName = $this->newSubscription->plan?->name ?? 'Free';

        return (new MailMessage)
            ->subject('⏰ انتهى اشتراكك')
            ->greeting("مرحباً {$notifiable->name}!")
            ->line("انتهى اشتراكك في خطة **{$expiredPlanName}**.")
            ->line("تم تحويلك تلقائياً إلى خطة **{$newPlanName}**.")
            ->line('يمكنك الترقية في أي وقت للحصول على جميع المميزات.')
            ->action('ترقية الآن', url('/plans'))
            ->line('شكراً لاستخدامك منصتنا!');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'subscription_expired',
            'message' => '⏰ انتهى اشتراكك وتم تحويلك للخطة المجانية',
            'expired_subscription_id' => $this->expiredSubscription->id,
            'expired_plan_name' => $this->expiredSubscription->plan?->name,
            'new_subscription_id' => $this->newSubscription->id,
            'new_plan_name' => $this->newSubscription->plan?->name,
        ];
    }
}
