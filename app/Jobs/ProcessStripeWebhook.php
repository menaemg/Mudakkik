<?php

namespace App\Jobs;

use App\Services\Payment\PaymentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessStripeWebhook implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * Delete the job if its models no longer exist.
     */
    public bool $deleteWhenMissingModels = true;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly string $eventType,
        public readonly array $eventData,
        public readonly string $eventId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(PaymentService $paymentService): void
    {
        Log::info('Processing Stripe webhook job', [
            'event_type' => $this->eventType,
            'event_id' => $this->eventId,
        ]);

        match ($this->eventType) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($paymentService),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($paymentService),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($paymentService),
            'invoice.payment_failed' => $this->handlePaymentFailed($paymentService),
            default => Log::info('Unhandled webhook event type', ['type' => $this->eventType]),
        };
    }

    /**
     * Handle checkout session completed event.
     */
    private function handleCheckoutCompleted(PaymentService $paymentService): void
    {
        $session = $this->eventData;
        
        // Extract metadata from session
        $metadata = $session['metadata'] ?? [];
        
        $data = [
            'session_id' => $session['id'] ?? null,
            'customer_id' => $session['customer'] ?? null,
            'subscription_id' => $session['subscription'] ?? null,
            'payment_status' => $session['payment_status'] ?? null,
            'amount_total' => ($session['amount_total'] ?? 0) / 100,
            'currency' => $session['currency'] ?? 'usd',
            'user_id' => $metadata['user_id'] ?? null,
            'plan_id' => $metadata['plan_id'] ?? null,
        ];

        Log::info('Processing checkout.session.completed', $data);

        $subscription = $paymentService->processSuccessfulPayment($data);

        if ($subscription) {
            Log::info('Subscription created via queue', ['subscription_id' => $subscription->id]);
        }
    }

    /**
     * Handle subscription updated event.
     */
    private function handleSubscriptionUpdated(PaymentService $paymentService): void
    {
        $subscription = $this->eventData;
        $providerSubscriptionId = $subscription['id'] ?? null;
        $status = $subscription['status'] ?? null;

        if (!$providerSubscriptionId) {
            Log::warning('Missing subscription ID in update event');
            return;
        }

        $localSubscription = \App\Models\Subscription::where('provider_subscription_id', $providerSubscriptionId)->first();

        if (!$localSubscription) {
            Log::warning('Local subscription not found', ['provider_subscription_id' => $providerSubscriptionId]);
            return;
        }

        // Map Stripe status to local status
        $statusMap = [
            'active' => 'active',
            'past_due' => 'past_due',
            'canceled' => 'cancelled',
            'unpaid' => 'past_due',
            'trialing' => 'active',
        ];

        $localSubscription->update([
            'status' => $statusMap[$status] ?? $status,
        ]);

        Log::info('Subscription updated via queue', [
            'subscription_id' => $localSubscription->id,
            'new_status' => $statusMap[$status] ?? $status,
        ]);
    }

    /**
     * Handle subscription deleted event.
     */
    private function handleSubscriptionDeleted(PaymentService $paymentService): void
    {
        $subscription = $this->eventData;
        $providerSubscriptionId = $subscription['id'] ?? null;

        if (!$providerSubscriptionId) {
            return;
        }

        $localSubscription = \App\Models\Subscription::where('provider_subscription_id', $providerSubscriptionId)->first();

        if ($localSubscription) {
            $localSubscription->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            Log::info('Subscription cancelled via queue', ['subscription_id' => $localSubscription->id]);
        }
    }

    /**
     * Handle payment failed event.
     */
    private function handlePaymentFailed(PaymentService $paymentService): void
    {
        $invoice = $this->eventData;
        $subscriptionId = $invoice['subscription'] ?? null;

        if (!$subscriptionId) {
            return;
        }

        $localSubscription = \App\Models\Subscription::where('provider_subscription_id', $subscriptionId)->first();

        if ($localSubscription) {
            $localSubscription->update(['status' => 'past_due']);

            Log::warning('Payment failed for subscription', ['subscription_id' => $localSubscription->id]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Stripe webhook job failed', [
            'event_type' => $this->eventType,
            'event_id' => $this->eventId,
            'error' => $exception->getMessage(),
        ]);
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return $this->eventId;
    }
}
