<?php

namespace App\Contracts;

use App\DTOs\CheckoutSession;
use App\DTOs\SessionData;
use App\DTOs\WebhookResult;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

interface PaymentProviderInterface
{
    /**
     * Create a checkout session for subscription payment.
     */
    public function createCheckoutSession(
        Plan $plan,
        User $user,
        string $successUrl,
        string $cancelUrl
    ): CheckoutSession;

    /**
     * Handle incoming webhook from the payment provider.
     */
    public function handleWebhook(Request $request): WebhookResult;

    /**
     * Retrieve session data by session ID.
     */
    public function retrieveSession(string $sessionId): ?SessionData;

    /**
     * Retrieve checkout session with URL for reuse.
     */
    public function getCheckoutSessionWithUrl(string $sessionId): ?CheckoutSession;

    /**
     * Cancel a subscription.
     */
    public function cancelSubscription(string $subscriptionId): bool;

    /**
     * Get the provider name.
     */
    public function getProviderName(): string;
}
