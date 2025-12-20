<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->realText(50),
            'body' => fake()->realText(1000),
            'status' => fake()->randomElement(['pending', 'published', 'rejected']),
            'ai_verdict' => fake()->randomElement(['موثوق', 'كاذب', 'مضلل']),
          
            'user_id' => \App\Models\User::all()->random()->id, 
            'category_id' => \App\Models\Category::all()->random()->id, 
        ];
    }
}
