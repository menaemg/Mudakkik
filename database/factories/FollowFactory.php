<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Follow>
 */
use App\Models\User;
class FollowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user1 = User::inRandomOrder()->first()?->id ?? User::factory();
        $user2 = User::where('id', '!=', $user1)->inRandomOrder()->first()?->id ?? User::factory();

        return [
            'following_user_id' => $user1,
            'followed_user_id' => $user2,
        ];
    }
}
