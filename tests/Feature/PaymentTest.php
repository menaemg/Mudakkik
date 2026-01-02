<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use App\Services\Payment\PaymentService;
use App\Services\Payment\StripeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\PlanSeeder::class);
    }

    public function test_guest_cannot_access_subscribe_route(): void
    {
        $plan = Plan::where('is_free', false)->first();

        $response = $this->post("/subscribe/{$plan->slug}");

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_subscribe_route(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('is_free', false)->first();

        // Mock the StripeService to avoid actual API calls
        $this->mock(StripeService::class, function ($mock) {
            $mock->shouldReceive('createCheckoutSession')
                ->once()
                ->andReturn(new \App\DTOs\CheckoutSession(
                    sessionId: 'cs_test_123',
                    url: 'https://checkout.stripe.com/test',
                    status: 'open',
                ));
            $mock->shouldReceive('getProviderName')
                ->andReturn('stripe');
        });

        $response = $this->actingAs($user)->post("/subscribe/{$plan->slug}");

        $response->assertRedirect();
    }

    public function test_free_plan_cannot_be_purchased(): void
    {
        $user = User::factory()->create();
        $freePlan = Plan::where('is_free', true)->first();

        $response = $this->actingAs($user)
            ->from('/plans')
            ->post("/subscribe/{$freePlan->slug}");

        // Should redirect back with validation errors
        $response->assertRedirect('/plans');
        $response->assertSessionHasErrors(['plan']);
    }

    public function test_nonexistent_plan_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/subscribe/nonexistent-plan');

        $response->assertNotFound();
    }

    public function test_payment_success_page_renders(): void
    {
        $user = User::factory()->create();

        // Without a paid subscription, should show processing state
        $response = $this->actingAs($user)->get('/payment/success');

        // Now returns 200 with processing state instead of redirecting
        $response->assertStatus(200);
    }

    public function test_payment_cancel_page_is_accessible(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/payment/cancel');

        $response->assertOk();
    }

    public function test_inactive_plan_cannot_be_subscribed(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('is_free', false)->first();
        $plan->update(['is_active' => false]);

        $response = $this->actingAs($user)
            ->from('/plans')
            ->post("/subscribe/{$plan->slug}");

        // Should redirect back with validation errors
        $response->assertRedirect('/plans');
        $response->assertSessionHasErrors(['plan']);
    }

    public function test_payment_model_has_correct_fillable_fields(): void
    {
        $payment = new \App\Models\Payment();
        
        $expectedFields = [
            'user_id',
            'ad_id',
            'subscription_id',
            'amount',
            'currency',
            'payment_method',
            'transaction_id',
            'idempotency_key',
            'provider',
            'provider_payment_id',
            'status',
            'metadata',
            'failure_reason',
        ];

        $this->assertEquals($expectedFields, $payment->getFillable());
    }
}
