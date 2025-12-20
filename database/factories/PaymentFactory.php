<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
            'user_id' => \App\Models\User::all()->random()->id,
            'amount' => fake()->randomFloat(2, 100, 1000),
            'payment_method' => fake()->randomElement(['فوري', 'بطاقة ائتمان', 'محفظة إلكترونية']),
            'transaction_id' => fake()->uuid(),
            'status' => 'accept',
        ];
    }
}
