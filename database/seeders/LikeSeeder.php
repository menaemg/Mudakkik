<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
    $userIds = User::pluck('id')->toArray();
    $postIds = Post::pluck('id')->toArray();

    if (empty($userIds) || empty($postIds)) {
      return;
    }

    $pairs = [];
    foreach ($userIds as $u) {
      foreach ($postIds as $p) {
        $pairs[] = ['user_id' => $u, 'post_id' => $p];
      }
    }

    shuffle($pairs);

    $limit = min(50, count($pairs));
    $toInsert = array_slice($pairs, 0, $limit);

    foreach ($toInsert as $pair) {
      Like::firstOrCreate($pair);
    }
  }
}
