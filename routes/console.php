<?php

use App\Jobs\HandleExpiredSubscriptions;
use App\Jobs\ReconcilePendingPayments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Reconcile pending Stripe payments every 10 minutes
Schedule::job(new ReconcilePendingPayments())->everyTenMinutes();

// Handle expired subscriptions daily at midnight
Schedule::job(new HandleExpiredSubscriptions())->daily();
