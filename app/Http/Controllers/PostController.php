<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{

  public function index()
  {
    $posts = Post::with(['user', 'category'])
      ->published()
      ->withCount('likes')
      ->latest()
      ->paginate(12);

    if (Auth::check()) {
      $posts->getCollection()->transform(function ($post) {
        $post->is_liked = $post->isLikedBy(Auth::id());
        return $post;
      });
    }

    return Inertia::render('Posts/Index', [
      'posts' => $posts
    ]);
  }


  public function show(Post $post)
  {
    $post->load(['user', 'category', 'likes.user']);
    $post->loadCount('likes');

    $post->is_liked = Auth::check()
      ? $post->isLikedBy(Auth::id())
      : false;

    return Inertia::render('Posts/Show', [
      'post' => $post
    ]);
  }
}
