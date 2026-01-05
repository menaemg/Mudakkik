<?php

namespace App\Services\Payment;

use App\Contracts\PaymentProviderInterface;
use App\DTOs\CheckoutSession;
use App\DTOs\SessionData;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\SubscriptionCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private PaymentProviderInterface $provider
    ) {}

    /**
     * Initiate a subscription checkout for a user.
     */
    public function initiateSubscription(
        Plan $plan,
        User $user,
        string $successUrl,
        string $cancelUrl
    ): CheckoutSession {
        // Generate idempotency key to prevent duplicate payments
        $idempotencyKey = $this->generateIdempotencyKey($user, $plan);

        // Create pending payment record
        $payment = $this->createPendingPayment($user, $plan, $idempotencyKey);

        // Build success URL manually - {CHECKOUT_SESSION_ID} must NOT be URL encoded
        // Stripe will replace this placeholder with the actual session ID
        $separator = str_contains($successUrl, '?') ? '&' : '?';
        $successUrl = $successUrl . $separator . 'session_id={CHECKOUT_SESSION_ID}&payment_id=' . $payment->id;

        return $this->provider->createCheckoutSession($plan, $user, $successUrl, $cancelUrl);
    }

    /**
     * Process a successful payment from webhook or success callback.
     */
    public function processSuccessfulPayment(array $data): ?Subscription
    {
        $userId = $data['user_id'] ?? null;
        $planId = $data['plan_id'] ?? null;
        $sessionId = $data['session_id'] ?? null;
        $subscriptionId = $data['subscription_id'] ?? null;

        if (!$userId || !$planId) {
            Log::warning('Missing user_id or plan_id in payment data', $data);
            return null;
        }

        // Check if payment already processed (idempotency)
        if ($sessionId) {
            $existingPayment = Payment::where('transaction_id', $sessionId)->first();
            if ($existingPayment) {
                Log::info('Payment already processed, skipping', ['session_id' => $sessionId]);
                // Return the existing subscription
                return Subscription::where('provider_subscription_id', $subscriptionId)->first();
            }
        }

        $user = User::find($userId);
        $plan = Plan::find($planId);

        if (!$user || !$plan) {
            Log::warning('User or plan not found', ['user_id' => $userId, 'plan_id' => $planId]);
            return null;
        }

        return DB::transaction(function () use ($user, $plan, $sessionId, $subscriptionId, $data) {
            // Double-check inside transaction for race conditions
            if ($sessionId) {
                $existingPayment = Payment::where('transaction_id', $sessionId)->lockForUpdate()->first();
                if ($existingPayment) {
                    return Subscription::where('provider_subscription_id', $data['subscription_id'] ?? null)->first();
                }
            }

            // Cancel any existing active subscription (including free plan)
            $existingSubscription = $user->currentSubscription();
            if ($existingSubscription) {
                $existingSubscription->cancel();
            }

            // Create new subscription
            $subscription = $user->subscriptions()->create([
                'plan_id' => $plan->id,
                'status' => 'active',
                'start_at' => now(),
                'ends_at' => $plan->duration_days ? now()->addDays($plan->duration_days) : null,
                'provider' => $this->provider->getProviderName(),
                'provider_subscription_id' => $subscriptionId,
                'auto_renew' => $plan->isRecurring(),
            ]);

            // Record the payment
            $this->recordPayment($user, $subscription, $data);

            Log::info('Subscription created successfully', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'plan' => $plan->slug,
            ]);

            // Send notification to user (works for any payment provider)
            $user->notify(new SubscriptionCreated($subscription));

            return $subscription;
        });
    }

    /**
     * Handle a cancelled/abandoned payment.
     */
    public function processCancelledPayment(?int $paymentId = null): void
    {
        if ($paymentId) {
            Payment::where('id', $paymentId)
                ->where('status', 'pending')
                ->update(['status' => 'failed']);
        }
    }

    /**
     * Retrieve session from provider.
     */
    public function retrieveSession(string $sessionId): ?SessionData
    {
        return $this->provider->retrieveSession($sessionId);
    }

    /**
     * Cancel a subscription.
     */
    public function cancelSubscription(Subscription $subscription): bool
    {
        if ($subscription->provider_subscription_id) {
            $cancelled = $this->provider->cancelSubscription($subscription->provider_subscription_id);
            if (!$cancelled) {
                return false;
            }
        }

        $subscription->cancel();
        return true;
    }

    /**
     * Record a payment in the database.
     */
    private function recordPayment(User $user, Subscription $subscription, array $data): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'amount' => (float) ($data['amount_total'] ?? 0), // Already converted from cents
            'currency' => strtoupper($data['currency'] ?? 'USD'),
            'payment_method' => 'card',
            'transaction_id' => $data['session_id'] ?? null,
            'provider' => $this->provider->getProviderName(),
            'provider_payment_id' => $data['subscription_id'] ?? $data['session_id'] ?? null,
            'status' => 'completed',
            'metadata' => $data,
        ]);
    }

    /**
     * Create a pending payment record.
     */
    private function createPendingPayment(User $user, Plan $plan, string $idempotencyKey): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'amount' => $plan->price,
            'currency' => 'USD',
            'payment_method' => 'card',
            'idempotency_key' => $idempotencyKey,
            'provider' => $this->provider->getProviderName(),
            'status' => 'pending',
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
            ],
        ]);
    }

    /**
     * Generate a unique idempotency key.
     */
    private function generateIdempotencyKey(User $user, Plan $plan): string
    {
        return Str::uuid()->toString() . "-{$user->id}-{$plan->id}";
    }
}
