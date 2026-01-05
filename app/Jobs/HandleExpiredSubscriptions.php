<?php

namespace App\Jobs;

use App\Models\Plan;
use App\Models\Subscription;
use App\Notifications\SubscriptionExpired;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HandleExpiredSubscriptions implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The unique lock will be released after 10 minutes.
     */
    public int $uniqueFor = 600;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Starting expired subscriptions job');

        // Find active paid subscriptions that have expired
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->whereHas('plan', fn($q) => $q->where('is_free', false))
            ->with(['user', 'plan'])
            ->get();

        Log::info('Found expired subscriptions', ['count' => $expiredSubscriptions->count()]);

        $freePlan = Plan::where('is_free', true)->where('is_active', true)->first();

        if (!$freePlan) {
            Log::warning('No active free plan found, cannot revert expired subscriptions');
            return;
        }

        foreach ($expiredSubscriptions as $subscription) {
            $this->handleExpiredSubscription($subscription, $freePlan);
        }

        Log::info('Expired subscriptions job completed');
    }

    /**
     * Handle a single expired subscription.
     */
    private function handleExpiredSubscription(Subscription $subscription, Plan $freePlan): void
    {
        try {
            DB::transaction(function () use ($subscription, $freePlan) {
                // Mark the old subscription as expired
                $subscription->update([
                    'status' => 'expired',
                ]);

                // Create a new free subscription
                $newSubscription = $subscription->user->subscriptions()->create([
                    'plan_id' => $freePlan->id,
                    'status' => 'active',
                    'start_at' => now(),
                    'ends_at' => null, // Free plans don't expire
                    'provider' => 'system',
                    'auto_renew' => false,
                ]);

                Log::info('User reverted to free plan', [
                    'user_id' => $subscription->user_id,
                    'old_subscription_id' => $subscription->id,
                    'new_subscription_id' => $newSubscription->id,
                    'expired_plan' => $subscription->plan->name,
                ]);

                // Notify the user
                $subscription->user->notify(new SubscriptionExpired($subscription, $newSubscription));
            });
        } catch (\Exception $e) {
            Log::error('Failed to handle expired subscription', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return 'handle-expired-subscriptions';
    }
}
