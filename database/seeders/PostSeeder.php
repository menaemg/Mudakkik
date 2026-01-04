<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;

class PostSeeder extends Seeder
{
   public function run(): void
{
    Post::factory(30)->create([
        'type' => 'article',
        'status' => 'published',
        'ai_verdict' => 'trusted',
        'views' => rand(500, 10000)
    ]);

    Post::factory(20)->create([
        'type' => 'news',
        'status' => 'published',
        'ai_verdict' => 'trusted',
    ]);
}
}
