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
        // Check for existing pending payment for the same plan (within last 30 minutes)
        $existingPayment = Payment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subMinutes(30))
            ->whereNotNull('provider_payment_id')
            ->whereJsonContains('metadata->plan_id', $plan->id)
            ->first();

        // If existing pending payment found, try to retrieve the session
        if ($existingPayment) {
            $sessionData = $this->provider->retrieveSession($existingPayment->provider_payment_id);
            
            // If session is still valid (not expired), return the existing checkout URL
            if ($sessionData && $sessionData->status !== 'expired') {
                // Retrieve the full session to get the URL
                $session = $this->provider->getCheckoutSessionWithUrl($existingPayment->provider_payment_id);
                if ($session && $session->url) {
                    return $session;
                }
            }
            
            // Session expired or invalid, mark payment as failed
            $existingPayment->markAsFailed('Checkout session expired');
        }

        // Create new pending payment and checkout session
        $separator = str_contains($successUrl, '?') ? '&' : '?';
        
        // Create checkout session first
        $checkout = $this->provider->createCheckoutSession($plan, $user, $successUrl, $cancelUrl);
        
        // Create pending payment with session info
        $payment = $this->createPendingPayment($user, $plan, $checkout->sessionId);
        
        return $checkout;
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

            $user->notify(new SubscriptionCreated($subscription));

            $this->refreshCredits($user, $plan);

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
    private function createPendingPayment(User $user, Plan $plan, string $sessionId): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'amount' => $plan->price,
            'currency' => 'USD',
            'payment_method' => 'card',
            'provider' => $this->provider->getProviderName(),
            'provider_payment_id' => $sessionId,
            'status' => 'pending',
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
            ],
        ]);
    }

    /**
     * Process a renewal payment (invoice.payment_succeeded).
     */
    public function processRenewalPayment(array $invoiceData): void
    {
        $subscriptionId = $invoiceData['subscription'] ?? null;
        if (!$subscriptionId) {
            return;
        }

        $subscription = Subscription::where('provider_subscription_id', $subscriptionId)->first();
        if (!$subscription) {
            Log::warning('Subscription not found for renewal', ['subscription_id' => $subscriptionId]);
            return;
        }

        $user = $subscription->user;
        $plan = $subscription->plan;

        if (!$user || !$plan) {
            Log::warning('User or plan not found for renewal', ['subscription_id' => $subscription->id]);
            return;
        }

        try {
            DB::transaction(function () use ($user, $plan, $subscription, $invoiceData, $subscriptionId) {
                // Refresh credits
                $this->refreshCredits($user, $plan);

                // Record payment
                $this->recordPayment($user, $subscription, [
                    'amount_total' => ($invoiceData['amount_paid'] ?? 0) / 100,
                    'currency' => $invoiceData['currency'] ?? 'usd',
                    'session_id' => $invoiceData['payment_intent'] ?? null,
                    'subscription_id' => $subscriptionId,
                    'metadata' => ['type' => 'renewal'],
                ]);
            });

            Log::info('Credits refreshed for renewal', ['user_id' => $user->id, 'plan' => $plan->slug]);
        } catch (\Exception $e) {
             Log::error('Failed to process renewal payment', [
                 'subscription_id' => $subscriptionId,
                 'error' => $e->getMessage()
             ]);
             throw $e;
        }
    }

    /**
     * Refresh user credits based on plan features.
     */
    public function refreshCredits(User $user, Plan $plan): void
    {
        $features = $plan->features ?? [];
        $aiCredits = $features['monthly_ai_credits'] ?? 0;
        $adCredits = $features['monthly_ad_credits'] ?? 0;


        
        $user->update([
            'ai_recurring_credits' => $aiCredits,
            'ad_credits' => $adCredits,
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
