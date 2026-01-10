<?php

namespace App\Observers;

use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;

class SubscriptionObserver
{
    private function clearBadgeCache(Subscription $subscription)
    {
        Cache::forget('sub_badge_' . $subscription->user_id);
    }

    public function created(Subscription $subscription): void
    {
        $this->clearBadgeCache($subscription);
    }

    public function updated(Subscription $subscription): void
    {
        $this->clearBadgeCache($subscription);
    }

    public function deleted(Subscription $subscription): void
    {
        $this->clearBadgeCache($subscription);
    }

    public function restored(Subscription $subscription): void
    {
        $this->clearBadgeCache($subscription);
    }
}س
