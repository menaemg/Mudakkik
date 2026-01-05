<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Notifications\PaymentFailed;
use App\Notifications\PaymentSuccessful;
use App\Notifications\StalePaymentAlert;
use App\Services\Payment\StripeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ReconcilePendingPayments implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 300;

    /**
     * The unique lock will be released after 10 minutes.
     */
    public int $uniqueFor = 600;

    /**
     * Execute the job.
     */
    public function handle(StripeService $stripeService): void
    {
        Log::info('Starting payment reconciliation job');

        // Find pending payments older than 5 minutes (give webhooks time to process)
        // Only check last 24 hours to avoid processing very old records
        Payment::where('status', 'pending')
            ->where('provider', 'stripe')
            ->whereNotNull('provider_payment_id')
            ->where('created_at', '<', now()->subMinutes(5))
            ->where('created_at', '>', now()->subHours(24))
            ->chunk(50, function ($payments) use ($stripeService) {
                foreach ($payments as $payment) {
                    $this->reconcilePayment($payment, $stripeService);
                }
            });

        // Alert admin about stale pending payments (older than 2 hours)
        $this->alertStalePayments();

        Log::info('Payment reconciliation job completed');
    }

    /**
     * Reconcile a single payment with Stripe.
     */
    private function reconcilePayment(Payment $payment, StripeService $stripeService): void
    {
        try {
            // provider_payment_id stores the checkout session ID
            $sessionData = $stripeService->retrieveSession($payment->provider_payment_id);

            if (!$sessionData) {
                Log::warning('Could not retrieve Stripe session', [
                    'payment_id' => $payment->id,
                    'session_id' => $payment->provider_payment_id,
                ]);
                return;
            }

            Log::info('Reconciling payment', [
                'payment_id' => $payment->id,
                'stripe_payment_status' => $sessionData->paymentStatus,
                'stripe_session_status' => $sessionData->status,
            ]);

            if ($sessionData->paymentStatus === 'paid') {
                // Payment succeeded - mark as completed
                $payment->update(['status' => 'completed']);

                // Also activate subscription if exists
                if ($payment->subscription) {
                    $payment->subscription->update(['status' => 'active']);
                    Log::info('Subscription activated via reconciliation', [
                        'subscription_id' => $payment->subscription->id,
                    ]);
                }

                // Notify user of successful payment
                if ($payment->user) {
                    $payment->user->notify(new PaymentSuccessful($payment));
                }
            } elseif ($sessionData->status === 'expired') {
                // Session expired - mark payment as failed
                $reason = 'Checkout session expired';
                $payment->markAsFailed($reason);
                Log::info('Payment marked as failed - session expired', [
                    'payment_id' => $payment->id,
                ]);

                // Notify user of failed payment
                if ($payment->user) {
                    $payment->user->notify(new PaymentFailed($payment, $reason));
                }
            }
            // If still 'unpaid', leave as pending for next reconciliation
        } catch (\Exception $e) {
            Log::error('Failed to reconcile payment', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Alert admin about payments stuck in pending for too long.
     */
    private function alertStalePayments(): void
    {
        $stalePayments = Payment::where('status', 'pending')
            ->where('provider', 'stripe')
            ->where('created_at', '<', now()->subHours(2))
            ->where('created_at', '>', now()->subHours(24))
            ->get();

        if ($stalePayments->isEmpty()) {
            return;
        }

        Log::warning('Stale pending payments detected', [
            'count' => $stalePayments->count(),
            'payment_ids' => $stalePayments->pluck('id')->toArray(),
        ]);

        // Notify admin users
        // Send to admin email from .env
        $adminEmail = config('mail.admin_email');
        if ($adminEmail) {
            Notification::route('mail', $adminEmail)
                ->notify(new StalePaymentAlert($stalePayments));
        }
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return 'reconcile-pending-payments';
    }
}
