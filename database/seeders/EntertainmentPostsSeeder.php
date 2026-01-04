<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;

class EntertainmentPostsSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'entertainment')->first();
        $user = User::first();

        if (!$category || !$user) {
            $this->command->error('Category or User not found');
            return;
        }

        for ($i = 1; $i <= 10; $i++) {
            $post = new Post([
                'title' => "خبر ترفيهي تجريبي رقم {$i}",
                'body' => 'هذا محتوى تجريبي لاختبار قسم الترفيه.',
                'image' => null,
                'status' => 'published',
                'category_id' => $category->id,
                'user_id' => $user->id,
                'ai_verdict' => 'trusted',
              ]);
            $post->slug = Str::slug("entertainment-post-{$i}");
            $post->type = 'article';
            $post->views = rand(10, 500);
            $post->created_at = now()->subDays(rand(0, 5));
            $post->save();
         }
        }
    }
