<?php

namespace Database\Factories;

use App\Models\User;
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
        $start = fake()->dateTimeBetween('now', '+1 month');
        $end = fake()->dateTimeBetween($start, $start->format('Y-m-d').' +1 month');

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title' => fake()->sentence(3),
            'image_path' => 'https://picsum.photos/200/300',
            'target_url' => fake()->url(),
            'requested_start_date' => $start,
            'requested_end_date' => $end,
            'admin_notes' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'waiting_payment']),
        ];
    }
}
