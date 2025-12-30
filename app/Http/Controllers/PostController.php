<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
  public function index(Request $request)
  {
    $query = Post::with(['user', 'category'])
      ->published()
      ->withCount('likes')
      ->latest();

    if ($request->filled('q')) {
      $q = $request->get('q');
      $query->where('title', 'like', "%{$q}%");
    }

    if ($request->filled('category')) {
      $cat = $request->get('category');
      if (is_numeric($cat)) {
        $query->where('category_id', $cat);
      } else {
        $category = Category::where('slug', $cat)->first();
        if ($category) {
          $query->where('category_id', $category->id);
        }
      }
    }

    $posts = $query->paginate(12);

    $posts->appends($request->only(['q', 'category']));

    if (Auth::check()) {
      $userId = Auth::id();
      $postIds = $posts->getCollection()->pluck('id')->toArray();
      $userLikes = [];
      if (!empty($postIds)) {
        $userLikes = Like::whereIn('post_id', $postIds)
          ->where('user_id', $userId)
          ->pluck('post_id')
          ->toArray();
      }

      $posts->getCollection()->transform(function ($post) use ($userLikes) {
        $post->is_liked = in_array($post->id, $userLikes);
        return $post;
      });
    }

    $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);

    return Inertia::render('Posts/Index', [
      'posts' => $posts,
      'categories' => $categories,
      'filters' => [
        'q' => $request->get('q'),
        'category' => $request->get('category'),
      ],
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
