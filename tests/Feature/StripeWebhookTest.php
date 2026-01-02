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
}
