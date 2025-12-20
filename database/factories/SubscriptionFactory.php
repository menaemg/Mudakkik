<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'plan_id' => \App\Models\Plan::factory(),

            'start_at' => now(),
            'ends_at' => now()->addMonths(1),
        ];
    }
}
