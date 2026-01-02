<?php

namespace Tests\Feature;

use App\Http\Controllers\Webhooks\StripeWebhookController;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\PlanSeeder::class);
    }

    public function test_webhook_rejects_request_without_signature(): void
    {
        $response = $this->postJson('/webhooks/stripe', [
            'type' => 'checkout.session.completed',
        ]);

        $response->assertStatus(400);
    }

    public function test_webhook_endpoint_exists(): void
    {
        $response = $this->post('/webhooks/stripe');

        // Should get 400 (bad request) not 404 (not found)
        $this->assertNotEquals(404, $response->getStatusCode());
    }

    public function test_subscription_can_be_marked_as_cancelled(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('is_free', false)->first();

        $subscription = $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'ends_at' => now()->addDays(30),
            'provider' => 'stripe',
            'provider_subscription_id' => 'sub_test_123',
        ]);

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        $this->assertEquals('cancelled', $subscription->fresh()->status);
        $this->assertNotNull($subscription->fresh()->cancelled_at);
    }

    public function test_subscription_status_changes_to_past_due(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('is_free', false)->first();

        $subscription = $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'ends_at' => now()->addDays(30),
            'provider' => 'stripe',
            'provider_subscription_id' => 'sub_test_456',
        ]);

        $subscription->update(['status' => 'past_due']);

        $this->assertTrue($subscription->fresh()->isPastDue());
    }

    public function test_webhook_result_dto_works_correctly(): void
    {
        $success = \App\DTOs\WebhookResult::success('checkout.session.completed', ['key' => 'value']);
        $this->assertTrue($success->success);
        $this->assertEquals('checkout.session.completed', $success->eventType);
        $this->assertEquals(['key' => 'value'], $success->data);

        $failure = \App\DTOs\WebhookResult::failure('error', 'Something went wrong');
        $this->assertFalse($failure->success);
        $this->assertEquals('Something went wrong', $failure->message);

        $ignored = \App\DTOs\WebhookResult::ignored('unknown.event');
        $this->assertTrue($ignored->success);
        $this->assertEquals('Event ignored', $ignored->message);
    }

    public function test_checkout_session_dto_works_correctly(): void
    {
        $session = new \App\DTOs\CheckoutSession(
            sessionId: 'cs_test_123',
            url: 'https://checkout.stripe.com/test',
            status: 'open',
            customerId: 'cus_123',
        );

        $this->assertEquals('cs_test_123', $session->sessionId);
        $this->assertEquals('https://checkout.stripe.com/test', $session->url);
        $this->assertEquals('open', $session->status);
        $this->assertEquals('cus_123', $session->customerId);
    }

    public function test_session_data_dto_works_correctly(): void
    {
        $data = new \App\DTOs\SessionData(
            sessionId: 'cs_test_123',
            status: 'complete',
            paymentStatus: 'paid',
            customerId: 'cus_123',
            customerEmail: 'test@example.com',
            subscriptionId: 'sub_123',
            amountTotal: 1999,
            currency: 'usd',
            metadata: ['user_id' => '1'],
        );

        $this->assertEquals('cs_test_123', $data->sessionId);
        $this->assertEquals('paid', $data->paymentStatus);
        $this->assertEquals(1999, $data->amountTotal);
        $this->assertEquals(['user_id' => '1'], $data->metadata);
    }
}
