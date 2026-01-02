<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubscribeRequest;
use App\Models\Plan;
use App\Services\Payment\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

    /**
     * Initiate subscription checkout for a plan.
     */
    public function subscribe(SubscribeRequest $request, Plan $plan): \Symfony\Component\HttpFoundation\Response
    {
        $user = $request->user();

        $checkout = $this->paymentService->initiateSubscription(
            plan: $plan,
            user: $user,
            successUrl: route('payment.success'),
            cancelUrl: route('payment.cancel'),
        );

        // Use Inertia::location() for external URL redirects
        return Inertia::location($checkout->url);
    }

    /**
     * Handle successful payment callback.
     * 
     * NOTE: This page does NOT create subscriptions. The webhook handles that.
     * This page only displays the success message and subscription details.
     */
    public function success(Request $request): Response|RedirectResponse
    {
        $user = auth()->user();

        // Refresh user to get latest subscription from webhook
        $user->refresh();
        $currentSubscription = $user->currentSubscription();

        // Check if user has an active paid subscription (created by webhook)
        if ($currentSubscription && !$currentSubscription->plan->is_free) {
            return Inertia::render('Payment/Success', [
                'subscription' => $currentSubscription->load('plan'),
            ]);
        }

        // Webhook might not have processed yet - show a "processing" message
        // or redirect with a message
        return Inertia::render('Payment/Success', [
            'subscription' => null,
            'processing' => true,
            'message' => 'جاري معالجة الدفع... يرجى الانتظار.',
        ]);
    }

    /**
     * Handle cancelled payment callback.
     */
    public function cancel(Request $request): Response
    {
        $paymentId = $request->query('payment_id');

        if ($paymentId) {
            $this->paymentService->processCancelledPayment((int) $paymentId);
        }

        return Inertia::render('Payment/Cancel', [
            'plans' => Plan::active()->paid()->ordered()->get(),
        ]);
    }
}
