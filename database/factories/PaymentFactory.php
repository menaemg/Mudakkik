<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Advertisment;
use App\Models\User;
use App\Models\Subscription;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     * Default state: no specific payment type (neither subscription nor ad).
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'ad_id' => null,
            'subscription_id' => null,
            'amount' => fake()->randomFloat(2, 10, 1000),
            'currency' => 'USD',
            'payment_method' => fake()->randomElement(['card', 'paypal']),
            'transaction_id' => fake()->uuid(),
            'provider' => 'stripe',
            'status' => fake()->randomElement(['pending', 'completed', 'failed', 'refunded']),
        ];
    }

    /**
     * Payment for subscription.
     */
    public function forSubscription(?Subscription $subscription = null): static
    {
        return $this->state(fn (array $attributes) => [
            'subscription_id' => $subscription?->id ?? Subscription::inRandomOrder()->first()?->id ?? Subscription::factory(),
            'ad_id' => null,
        ]);
    }

    /**
     * Payment for advertisement.
     */
    public function forAdvertisement(?Advertisment $ad = null): static
    {
        return $this->state(fn (array $attributes) => [
            'ad_id' => $ad?->id ?? Advertisment::inRandomOrder()->first()?->id,
            'subscription_id' => null,
        ]);
    }

    /**
     * Pending payment state.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Completed payment state.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
