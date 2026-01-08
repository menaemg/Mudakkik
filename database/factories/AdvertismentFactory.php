<?php

namespace Database\Factories;

use App\Models\Subscription;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Advertisment>
 */
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdvertismentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array
{
    $startDate = fake()->dateTimeBetween('-1 month', 'now');

    $endDate = fake()->dateTimeBetween('+1 week', '+2 months');

    $user = User::inRandomOrder()->first() ?? User::factory();

    return [
        'user_id' => $user,
        'subscription_id' => Subscription::where('user_id', $user->id)
            ->inRandomOrder()
            ->first()?->id ?? Subscription::factory()->for($user),
        'title' => fake()->words(3, true),
        'image_url' => 'https://placehold.co/800x400/2a2a2a/FFF',
        'target_link' => fake()->url(),
        'number_of_days' => fake()->numberBetween(1, 60),
        'admin_notes' => fake()->optional()->sentence(),

        'start_date' => $startDate,
        'end_date' => $endDate,

        'status' => fake()->randomElement(['pending', 'approved', 'rejected']),

        'position' => $this->faker->randomElement([
            'home_strip',
            'hero_bottom',
            'entertainment_agenda',
            'topics_bottom'
        ]),
    ];
}}
