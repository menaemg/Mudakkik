<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = now();
        $end = now()->addMonth();

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'plan_id' => Plan::inRandomOrder()->first()?->id ?? Plan::factory(),
            'start_at' => $start,
            'ends_at' => $end,
            'status' => 'active',
            'provider' => null,
            'provider_subscription_id' => null,
            'auto_renew' => true,
            'cancelled_at' => null,
            'trial_ends_at' => null,
            'admin_notes' => null,
        ];
    }

    /**
     * Indicate that the subscription is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'auto_renew' => false,
        ]);
    }

    /**
     * Indicate that the subscription is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'ends_at' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the subscription is past due.
     */
    public function pastDue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'past_due',
        ]);
    }
}
