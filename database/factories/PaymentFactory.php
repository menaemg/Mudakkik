<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Advertisment;
use App\Models\User;
use App\Models\Subscription;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
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
            'ad_id' => Advertisment::inRandomOrder()->first()?->id,
            'subscription_id' => Subscription::inRandomOrder()->first()?->id,
            'amount' => fake()->randomFloat(2, 10, 1000),
            'payment_method' => fake()->randomElement(['Credit Card', 'PayPal', 'Cash']),
            'transaction_id' => fake()->uuid(), 
            'status' => fake()->randomElement(['accept', 'fail', 'refuse']),
        ];
    }
}
