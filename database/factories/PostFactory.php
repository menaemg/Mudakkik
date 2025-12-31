<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
use App\Models\User;
use App\Models\Category;

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
'title' => fake()->sentence(),
        'body' => fake()->paragraphs(4, true), 
        'image' => fake()->imageUrl(640, 480, 'news'), 
        'status' => fake()->randomElement(array: ['pending', 'published', 'rejected']),
        'ai_verdict' => fake()->randomElement(['trusted', 'fake', 'misleading']),
        'user_id' => User::factory(), 
        'category_id' => Category::factory(),
        'is_featured' => fake()->boolean(20),
        ];
    }
}
