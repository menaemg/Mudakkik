<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'name' => fake()->randomElement(['Basic Plan', 'Premium Plan', 'Enterprise Plan']),
            'price' => fake()->randomFloat(2, 10, 500), 
            'features' => fake()->paragraph(), 
        ];
    }
}
