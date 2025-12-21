<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Advertisment>
 */
use App\Models\User;
class AdvertismentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +2 months');

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title' => fake()->words(3, true),
            'image_url' => fake()->imageUrl(640, 480, 'ads'), // يولد رابط صورة وهمي
            'target_link' => fake()->url(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => fake()->randomElement(['run', 'stop']),
        ];
    }
}
