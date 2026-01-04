<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing categories and users
        $categories = Category::all();
        $journalists = User::where('role', 'journalist')->get();
        $tags = Tag::all();

        // Create published articles (trusted)
        Post::factory(25)->create([
            'type' => 'article',
            'status' => 'published',
            'ai_verdict' => 'trusted',
            'user_id' => fn() => $journalists->random()->id,
            'category_id' => fn() => $categories->random()->id,
        ])->each(function ($post) use ($tags) {
            // Attach 2-4 random tags
            $post->tags()->attach($tags->random(rand(2, 4))->pluck('id'));
        });

        // Create published news (trusted)
        Post::factory(20)->create([
            'type' => 'news',
            'status' => 'published',
            'ai_verdict' => 'trusted',
            'user_id' => fn() => $journalists->random()->id,
            'category_id' => fn() => $categories->random()->id,
        ])->each(function ($post) use ($tags) {
            $post->tags()->attach($tags->random(rand(2, 3))->pluck('id'));
        });

        // Create some pending posts for admin review
        Post::factory(5)->create([
            'type' => 'news',
            'status' => 'pending',
            'ai_verdict' => 'checking',
        ]);
    }
}
