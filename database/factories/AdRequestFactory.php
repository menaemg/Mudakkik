<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdRequest>
 */
class AdRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::all()->random()->id,
            'title' => fake()->realText(30) . " - إعلان ممول",
            'image_path' => 'ads/default.jpg',
            'target_url' => fake()->url(),
            'requested_start_date' => now()->addDays(fake()->numberBetween(1, 5)),
            'requested_end_date' => now()->addDays(fake()->numberBetween(10, 30)),
            'status' => 'pending',
        ];
    }
}
