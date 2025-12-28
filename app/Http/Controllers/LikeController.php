<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class LikeController extends Controller
{
  /**
   * Toggle Like/Unlike
   */
  public function toggle(Post $post)
  {
    $user = Auth::user();

    $like = Like::where('user_id', $user->id)
      ->where('post_id', $post->id)
      ->first();

    if ($like) {
      $like->delete();
      $isLiked = false;
      $message = 'تم إلغاء الإعجاب';
    } else {
      Like::create([
        'user_id' => $user->id,
        'post_id' => $post->id
      ]);
      $isLiked = true;
      $message = 'تم الإعجاب بالمنشور';
    }

    $likesCount = $post->likes()->count();

    return back()->with([
      'message' => $message,
      'likesCount' => $likesCount,
      'isLiked' => $isLiked
    ]);
  }
}
