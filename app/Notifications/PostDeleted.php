<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PostDeleted extends Notification implements ShouldQueue
{
    use Queueable;

    public $postTitle;

    /**
     * Create a new notification instance.
     */
    public function __construct($postTitle)
    {
        $this->postTitle = $postTitle;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تنبيه: قام المسؤول بحذف مقالك: '{$this->postTitle}' لمخالفته الشروط.",
            'type' => 'danger',
            'url' => null
        ];
    }
}
