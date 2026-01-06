<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\User;
use App\Models\Plan;
use App\Jobs\HandleExpiredSubscriptions;
use App\Jobs\ReconcilePendingPayments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;


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
        $query->active()->whereHas('plan', fn($q) => $q->where('slug', 'professional'));
    })->update([
        'ai_recurring_credits' => 1000,
        'ad_credits' => 30
    ]);

        User::whereHas('subscriptions', function ($query) {
        $query->active()->whereHas('plan', fn($q) => $q->where('slug', 'professional-annual'));
    })->update([
        'ai_recurring_credits' => 12000,
        'ad_credits' => 365
    ]);


    \Log::info('Monthly credits reset completed.');

})->monthly();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Reconcile pending Stripe payments every 10 minutes
Schedule::job(new ReconcilePendingPayments())->everyTenMinutes();

// Handle expired subscriptions daily at midnight
Schedule::job(new HandleExpiredSubscriptions())->daily();
