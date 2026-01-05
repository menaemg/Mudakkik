<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\User;
use App\Models\Plan;

Schedule::call(function () {

    User::whereHas('subscriptions', function ($query) {
        $query->active()->whereHas('plan', fn($q) => $q->where('slug', 'free'));
    })->update(['ai_recurring_credits' => 30]);


    User::whereHas('subscriptions', function ($query) {
        $query->active()->whereHas('plan', fn($q) => $q->where('slug', 'basic'));
    })->update([
        'ai_recurring_credits' => 100,
        'ad_credits' => 7
    ]);

    User::whereHas('subscriptions', function ($query) {
        $query->active()->whereHas('plan', fn($q) => $q->where('slug', 'pro'));
    })->update([
        'ai_recurring_credits' => 1000,
        'ad_credits' => 30
    ]);

    \Log::info('Monthly credits reset completed.');

})->monthly();
