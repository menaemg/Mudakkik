<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionCreated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Subscription $subscription
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
        $planName = $this->subscription->plan?->name ?? 'Premium';
        $endsAt = $this->subscription->ends_at?->format('Y-m-d') ?? 'غير محدد';

        return (new MailMessage)
            ->subject('🎉 مرحباً بك في اشتراكك الجديد!')
            ->greeting("مرحباً {$notifiable->name}!")
            ->line('تم تفعيل اشتراكك بنجاح.')
            ->line("**الخطة:** {$planName}")
            ->line("**تاريخ الانتهاء:** {$endsAt}")
            ->action('عرض اشتراكي', url('/my-subscription'))
            ->line('شكراً لثقتك بنا!');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'subscription_created',
            'message' => '🎉 تم تفعيل اشتراكك بنجاح',
            'subscription_id' => $this->subscription->id,
            'plan_name' => $this->subscription->plan?->name,
        ];
    }
}
