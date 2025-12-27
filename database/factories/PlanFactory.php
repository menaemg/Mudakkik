<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement(['Basic Plan', 'Premium Plan', 'Enterprise Plan']);
        $billingInterval = fake()->randomElement(['monthly', 'yearly', 'one_time']);
        
        $durationDays = match ($billingInterval) {
            'monthly' => 30,
            'yearly' => 365,
            'one_time' => null,
        };
        
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->randomNumber(4),
            'price' => fake()->randomFloat(2, 10, 500),
            'billing_interval' => $billingInterval,
            'duration_days' => $durationDays,
            'provider_price_id' => null,
            'is_free' => false,
            'is_active' => true,
            'sort_order' => 0,
            'features' => [
                'posts_limit' => fake()->numberBetween(10, 100),
                'ads_limit' => fake()->numberBetween(0, 20),
                'priority_support' => fake()->boolean(),
            ],
        ];
    }

    /**
     * Indicate that the plan is free.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Free Plan',
            'slug' => 'free-' . fake()->unique()->randomNumber(4),
            'price' => 0,
            'billing_interval' => 'one_time',
            'duration_days' => null,
            'is_free' => true,
        ]);
    }
}
