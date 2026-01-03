<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostDeleted extends Notification
{
    use Queueable;

    public $postTitle;

    public function __construct($postTitle)
    {
        $this->postTitle = $postTitle;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "تنبيه: قام المسؤول بحذف مقالك: '{$this->postTitle}' لمخالفته الشروط.",
            'type' => 'danger',
            'link' => null
        ];
    }
}
