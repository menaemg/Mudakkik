<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed plans
        $this->seed(\Database\Seeders\PlanSeeder::class);
    }

    public function test_plans_page_can_be_rendered(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/plans');

        $response->assertStatus(200);
    }

    public function test_subscription_page_can_be_rendered(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/my-subscription');

        $response->assertStatus(200);
    }

    public function test_free_plan_exists(): void
    {
        $freePlan = Plan::where('is_free', true)->first();

        $this->assertNotNull($freePlan);
        $this->assertEquals('free', $freePlan->slug);
        $this->assertEquals(0, $freePlan->price);
    }

    public function test_plan_has_correct_attributes(): void
    {
        $plan = Plan::where('slug', 'basic')->first();

        $this->assertNotNull($plan);
        $this->assertTrue($plan->isActive());
        $this->assertFalse($plan->isFree());
        $this->assertTrue($plan->isRecurring());
    }

    public function test_user_can_have_subscription(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('is_free', true)->first();

        $subscription = $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'ends_at' => null,
        ]);

        $this->assertTrue($subscription->isActive());
        $this->assertNotNull($user->currentSubscription());
        $this->assertTrue($user->hasActiveSubscription());
    }

    public function test_subscription_days_remaining(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('slug', 'basic')->first();

        $subscription = $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'ends_at' => now()->addDays(15),
        ]);

        $this->assertGreaterThanOrEqual(14, $subscription->daysRemaining());
        $this->assertLessThanOrEqual(15, $subscription->daysRemaining());
    }

    public function test_subscription_can_be_cancelled(): void
    {
        $user = User::factory()->create();
        $plan = Plan::where('slug', 'basic')->first();

        $subscription = $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'ends_at' => now()->addDays(30),
        ]);

        $subscription->cancel();

        $this->assertTrue($subscription->isCancelled());
        $this->assertNotNull($subscription->cancelled_at);
    }

    public function test_new_user_gets_free_plan_on_registration(): void
    {
        $user = User::factory()->create();

        // User should automatically have a subscription to the free plan
        $this->assertTrue($user->hasActiveSubscription());
        $this->assertTrue($user->isOnFreePlan());
        $this->assertNotNull($user->currentSubscription());
        $this->assertEquals('free', $user->currentPlan()?->slug);
    }
}
