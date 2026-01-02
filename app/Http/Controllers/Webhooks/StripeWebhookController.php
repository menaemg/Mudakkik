<?php

namespace App\Http\Controllers\Webhooks;

use App\Contracts\PaymentProviderInterface;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessStripeWebhook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function __construct(
        private PaymentProviderInterface $stripeService,
    ) {}

    /**
     * Handle incoming Stripe webhook.
     * 
     * The webhook is verified synchronously, but processing is done via queue
     * for better performance and reliability.
     */
    public function handle(Request $request): JsonResponse
    {
        // Verify webhook signature synchronously (must be done before dispatching)
        $result = $this->stripeService->handleWebhook($request);

        if (!$result->success) {
            Log::warning('Stripe webhook verification failed', [
                'event_type' => $result->eventType,
                'message' => $result->message,
            ]);

            return response()->json(['error' => $result->message], 400);
        }

        // Get the raw event data from the request
        $payload = json_decode($request->getContent(), true);
        $eventId = $payload['id'] ?? 'unknown';
        $eventType = $payload['type'] ?? 'unknown';
        $eventData = $payload['data']['object'] ?? [];

        // Dispatch to queue for async processing
        ProcessStripeWebhook::dispatch(
            eventType: $eventType,
            eventData: $eventData,
            eventId: $eventId,
        );

        Log::info('Stripe webhook dispatched to queue', [
            'event_id' => $eventId,
            'event_type' => $eventType,
        ]);

        // Return 200 immediately - Stripe expects fast response
        return response()->json(['received' => true, 'queued' => true]);
    }
}
