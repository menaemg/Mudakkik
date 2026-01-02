<?php

namespace App\Services\Payment;

use App\Contracts\PaymentProviderInterface;
use App\DTOs\CheckoutSession;
use App\DTOs\SessionData;
use App\DTOs\WebhookResult;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeService implements PaymentProviderInterface
{
    private ?StripeClient $stripe = null;

    public function __construct()
    {
        $secret = config('services.stripe.secret');
        if ($secret) {
            $this->stripe = new StripeClient($secret);
        }
    }

    /**
     * Check if the service is properly configured.
     */
    private function isConfigured(): bool
    {
        return $this->stripe !== null;
    }

    /**
     * Ensure the service is configured, throw exception if not.
     */
    private function ensureConfigured(): void
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('Stripe service is not configured. Please set STRIPE_SECRET in .env');
        }
    }

    /**
     * Create a Stripe Checkout session for subscription payment.
     */
    public function createCheckoutSession(
        Plan $plan,
        User $user,
        string $successUrl,
        string $cancelUrl
    ): CheckoutSession {
        $this->ensureConfigured();
        
        try {
            $sessionParams = [
                'customer_email' => $user->email,
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
                'metadata' => [
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'plan_slug' => $plan->slug,
                ],
            ];

            // Use Stripe Price ID if available, otherwise create line item
            if ($plan->provider_price_id) {
                $sessionParams['line_items'] = [[
                    'price' => $plan->provider_price_id,
                    'quantity' => 1,
                ]];
                $sessionParams['mode'] = $plan->isRecurring() ? 'subscription' : 'payment';
            } else {
                $sessionParams['line_items'] = [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $plan->name,
                            'description' => "Subscription to {$plan->name} plan",
                        ],
                        'unit_amount' => (int) ($plan->price * 100), // Convert to cents
                        'recurring' => $plan->isRecurring() ? [
                            'interval' => $plan->billing_interval === 'yearly' ? 'year' : 'month',
                        ] : null,
                    ],
                    'quantity' => 1,
                ]];
                $sessionParams['mode'] = $plan->isRecurring() ? 'subscription' : 'payment';

                // Remove recurring for non-recurring plans
                if (!$plan->isRecurring()) {
                    unset($sessionParams['line_items'][0]['price_data']['recurring']);
                }
            }

            // For subscription mode, also add metadata to subscription_data
            if ($sessionParams['mode'] === 'subscription') {
                $sessionParams['subscription_data'] = [
                    'metadata' => [
                        'user_id' => (string) $user->id,
                        'plan_id' => (string) $plan->id,
                        'plan_slug' => $plan->slug,
                    ],
                ];
            }

            // Cast metadata values to strings (Stripe requirement)
            $sessionParams['metadata'] = [
                'user_id' => (string) $user->id,
                'plan_id' => (string) $plan->id,
                'plan_slug' => $plan->slug,
            ];

            $session = $this->stripe->checkout->sessions->create($sessionParams);

            return new CheckoutSession(
                sessionId: $session->id,
                url: $session->url,
                status: $session->status,
                customerId: $session->customer,
            );
        } catch (ApiErrorException $e) {
            Log::error('Stripe session creation failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'plan_id' => $plan->id,
            ]);
            throw $e;
        }
    }

    /**
     * Handle Stripe webhook events.
     */
    public function handleWebhook(Request $request): WebhookResult
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);
            return WebhookResult::failure('signature_error', 'Invalid signature');
        }

        return match ($event->type) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($event->data->object),
            'checkout.session.expired' => $this->handleCheckoutExpired($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event->data->object),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event->data->object),
            'invoice.payment_failed' => $this->handlePaymentFailed($event->data->object),
            default => WebhookResult::ignored($event->type),
        };
    }

    /**
     * Retrieve session data from Stripe.
     */
    public function retrieveSession(string $sessionId): ?SessionData
    {
        $this->ensureConfigured();
        
        try {
            $session = $this->stripe->checkout->sessions->retrieve($sessionId, [
                'expand' => ['subscription', 'customer'],
            ]);

            return new SessionData(
                sessionId: $session->id,
                status: $session->status,
                paymentStatus: $session->payment_status,
                customerId: $session->customer?->id ?? $session->customer,
                customerEmail: $session->customer_email ?? $session->customer?->email,
                subscriptionId: $session->subscription?->id ?? $session->subscription,
                amountTotal: $session->amount_total,
                currency: $session->currency,
                metadata: $session->metadata?->toArray() ?? [],
            );
        } catch (ApiErrorException $e) {
            Log::error('Failed to retrieve Stripe session', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Cancel a Stripe subscription.
     */
    public function cancelSubscription(string $subscriptionId): bool
    {
        $this->ensureConfigured();
        try {
            $this->stripe->subscriptions->cancel($subscriptionId);
            return true;
        } catch (ApiErrorException $e) {
            Log::error('Failed to cancel Stripe subscription', [
                'subscription_id' => $subscriptionId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function getProviderName(): string
    {
        return 'stripe';
    }

    /**
     * Handle checkout.session.completed event.
     */
    private function handleCheckoutCompleted(object $session): WebhookResult
    {
        // Try multiple ways to access metadata
        $metadata = [];
        if (isset($session->metadata)) {
            if (is_array($session->metadata)) {
                $metadata = $session->metadata;
            } elseif (is_object($session->metadata)) {
                $metadata = (array) $session->metadata;
                // Also try toArray if available (Stripe objects)
                if (method_exists($session->metadata, 'toArray')) {
                    $metadata = $session->metadata->toArray();
                }
            }
        }

        Log::info('Checkout session completed - processing', [
            'session_id' => $session->id,
            'metadata_raw' => $session->metadata ?? 'none',
            'metadata_parsed' => $metadata,
            'user_id' => $metadata['user_id'] ?? null,
            'plan_id' => $metadata['plan_id'] ?? null,
        ]);

        return WebhookResult::success('checkout.session.completed', [
            'session_id' => $session->id,
            'customer_id' => $session->customer,
            'subscription_id' => $session->subscription,
            'payment_status' => $session->payment_status,
            'amount_total' => $session->amount_total,
            'currency' => $session->currency,
            'user_id' => $metadata['user_id'] ?? null,
            'plan_id' => $metadata['plan_id'] ?? null,
        ]);
    }

    /**
     * Handle checkout.session.expired event.
     */
    private function handleCheckoutExpired(object $session): WebhookResult
    {
        Log::info('Checkout session expired', ['session_id' => $session->id]);

        return WebhookResult::success('checkout.session.expired', [
            'session_id' => $session->id,
        ]);
    }

    /**
     * Handle customer.subscription.deleted event.
     */
    private function handleSubscriptionDeleted(object $subscription): WebhookResult
    {
        return WebhookResult::success('customer.subscription.deleted', [
            'subscription_id' => $subscription->id,
            'customer_id' => $subscription->customer,
        ]);
    }

    /**
     * Handle customer.subscription.updated event.
     */
    private function handleSubscriptionUpdated(object $subscription): WebhookResult
    {
        return WebhookResult::success('customer.subscription.updated', [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'current_period_end' => $subscription->current_period_end,
        ]);
    }

    /**
     * Handle invoice.payment_failed event.
     */
    private function handlePaymentFailed(object $invoice): WebhookResult
    {
        return WebhookResult::success('invoice.payment_failed', [
            'invoice_id' => $invoice->id,
            'subscription_id' => $invoice->subscription,
            'customer_id' => $invoice->customer,
        ]);
    }
}
