<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Like;
use App\Models\User;
use App\Models\Post;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
   {
        $users = User::all();
        $posts = Post::all();

        if ($users->isEmpty() || $posts->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $user = $users->random();
            $post = $posts->random();
            Like::firstOrCreate([
                'user_id' => $user->id,
                'post_id' => $post->id
            ]);
        }
    }
}
