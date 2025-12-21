<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UpgreadRequest>
 */
use App\Models\User;
class UpgreadRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'documents' => 'documents/sample_id.pdf',
            'admin_notes' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}
