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
            'name' => fake()->randomElement(['الباقة الفضية', 'الباقة الذهبية', 'باقة المؤسسات']),
            'price' => fake()->randomElement([0, 150, 500]),
            'features' => fake()->realText(100),
        ];
    }
}
