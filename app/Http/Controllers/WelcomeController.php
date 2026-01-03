<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\HomeSlot;
use App\Models\Advertisment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

class WelcomeController extends Controller
{
    public function index()
    {
        $safeQuery = function($query) {
            return $query->where('status', 'published')
                         ->where(function($q) {
                             $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict');
                         });
        };

        $allSlots = HomeSlot::with(['post' => function($q) {
                $q->select('id', 'title', 'slug', 'image', 'created_at', 'category_id', 'user_id', 'views', 'is_breaking', 'type');
            }, 'post.user:id,name,avatar', 'post.category:id,name,slug'])
            ->get()
            ->groupBy('section');

        $excludeIds = [];

        $tickerSlots = $allSlots->get('ticker')?->keyBy('slot_name') ?? collect();
        $tickerPosts = collect();
        for ($i = 1; $i <= 5; $i++) {
            $post = $tickerSlots->get((string)$i)?->post;
            if (!$post) {
                $post = Post::where('type', 'news')->tap($safeQuery)->whereNotIn('id', $excludeIds)->latest()->select('id', 'title', 'slug', 'is_breaking')->first();
            }
            if ($post) { $tickerPosts->push($post); $excludeIds[] = $post->id; }
        }

        $heroSlots = $allSlots->get('hero')?->keyBy('slot_name') ?? collect();

        $heroMain = $heroSlots->get('main')?->post;
        if (!$heroMain) $heroMain = Post::where('type', 'article')->tap($safeQuery)->whereNotIn('id', $excludeIds)->with(['user', 'category'])->latest()->first();
        if ($heroMain) $excludeIds[] = $heroMain->id;

        $heroSide = Post::where('type', 'news')->tap($safeQuery)->whereNotIn('id', $excludeIds)->latest()->take(4)->with('category')->get();
        $excludeIds = array_merge($excludeIds, $heroSide->pluck('id')->toArray());

        $stripPosts = [];
        foreach (['strip_1', 'strip_2'] as $slotName) {
            $post = $heroSlots->get($slotName)?->post;
            if (!$post) $post = Post::where('type', 'article')->tap($safeQuery)->whereNotIn('id', $excludeIds)->inRandomOrder()->with('user')->first();
            if ($post) { $stripPosts[] = $post; $excludeIds[] = $post->id; }
        }

        $featuredSlots = $allSlots->get('featured')?->keyBy('slot_name') ?? collect();
        $editorsSlots = $allSlots->get('editors_choice')?->keyBy('slot_name') ?? collect();

        $featuredMain = $featuredSlots->get('main')?->post;
        if ($featuredMain) $excludeIds[] = $featuredMain->id;

        $featuredSubs = collect();
        for ($i = 1; $i <= 4; $i++) {
            $post = $featuredSlots->get("sub_{$i}")?->post;
            $featuredSubs->push($post);
            if ($post) $excludeIds[] = $post->id;
        }

        $editorsChoice = collect();
        for ($i = 1; $i <= 4; $i++) {
            $post = $editorsSlots->get((string)$i)?->post;
            $editorsChoice->push($post);
            if ($post) $excludeIds[] = $post->id;
        }

        $trending = Post::tap($safeQuery)->whereNotIn('id', $excludeIds)->orderByDesc('views')->take(5)->with('category')->get();

        try {
            $ads = Advertisment::where('status', 'run')->whereDate('start_date', '<=', now())->whereDate('end_date', '>=', now())->get()->groupBy('position');
        } catch (\Exception $e) { $ads = []; }


          $topStoriesSlots = $allSlots->get('top_stories')?->keyBy('slot_name') ?? collect();
          $topStories = collect();

          $slotOrder = ['large_1', 'large_2', 'small_1', 'small_2', 'small_3', 'small_4'];

          foreach ($slotOrder as $slotName) {
          $post = $topStoriesSlots->get($slotName)?->post;

        if (!$post) {
            $post = Post::where('type', 'article')
                ->tap($safeQuery)
                ->whereNotIn('id', $excludeIds)
                ->where('created_at', '>=', now()->subHours(48))
                ->orderByDesc('views')
                ->with(['user', 'category'])
                ->first();

            if (!$post) {
            $post = Post::tap($safeQuery)->whereNotIn('id', $excludeIds)->with(['user', 'category'])->latest()->first();
            }
        }

      if ($post) {
          $post->is_large = str_contains($slotName, 'large');
          $topStories->push($post);
          $excludeIds[] = $post->id;
      }
  }

    // $entertainmentCategory = Category::where('slug', 'entertainment')
    //     ->orWhere('name', 'like', '%ترفيه%')
    //     ->first();

    // $entertainmentPosts = collect();

    // if ($entertainmentCategory) {
    //     $entSlots = $allSlots->get('entertainment')?->keyBy('slot_name') ?? collect();

    //     $entertainmentPosts = Post::tap($safeQuery)
    //         ->where('category_id', $entertainmentCategory->id)
    //         ->whereNotIn('id', $excludeIds)
    //         ->latest()
    //         ->take(6)
    //         ->with(['user', 'category'])
    //         ->get();

    //     $excludeIds = array_merge($excludeIds, $entertainmentPosts->pluck('id')->toArray());
    // }

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'), 'canRegister' => Route::has('register'),
            'auth' => ['user' => Auth::user()],
            'ticker' => $tickerPosts,
            'hero' => ['main' => $heroMain, 'side' => $heroSide, 'trending' => $trending, 'strip' => $stripPosts],

            'featured' => [
                'main' => $featuredMain,
                'subs' => $featuredSubs,
                'editors' => $editorsChoice
            ],

            'ads' => $ads,
            'topics' => Category::withCount('posts')->orderByDesc('posts_count')->take(8)->get(),
            'topStories' => $topStories,
            // 'entertainmentPosts' => $entertainmentPosts
        ]);
    }
}
