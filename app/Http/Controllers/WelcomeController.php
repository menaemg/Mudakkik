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

        $allSlots = HomeSlot::with([
            'post' => function($q) use ($safeQuery) {
                $q->tap($safeQuery)
                  ->select(
                  'id',
                  'title',
                  'slug',
                  'image',
                  'created_at',
                  'category_id',
                  'user_id',
                  'views',
                  'is_breaking',
                  'type',
                  'status',
                  'ai_verdict'
                );
            },
            'post.user:id,name,avatar',
            'post.category:id,name,slug'
        ])->get()->groupBy('section');

        $excludeIds = [];

        $tickerSlots = $allSlots->get('ticker')?->keyBy('slot_name') ?? collect();
        $tickerPosts = collect();
        $tickerFallbackPosts = Post::where('type', 'news')
            ->tap($safeQuery)
            ->latest()
            ->select('id', 'title', 'slug', 'is_breaking')
            ->take(5)
            ->get();

        for ($i = 1; $i <= 5; $i++) {
            $post = $tickerSlots->get((string)$i)?->post ?? $tickerFallbackPosts->shift();
            if ($post) {
                $tickerPosts->push($post);
                $excludeIds[] = $post->id;
            }
        }

        $heroSlots = $allSlots->get('hero')?->keyBy('slot_name') ?? collect();

        $heroMain = $heroSlots->get('main')?->post;
        if (!$heroMain) {
            $heroMain = Post::where('type', 'article')
                ->tap($safeQuery)
                ->with(['user:id,name,avatar', 'category:id,name,slug'])
                ->latest()
                ->first();
        }
        if ($heroMain) $excludeIds[] = $heroMain->id;

        $heroSide = Post::where('type', 'news')
            ->tap($safeQuery)
            ->whereNotIn('id', $excludeIds)
            ->with('category:id,name,slug')
            ->latest()
            ->take(4)
            ->get();
        $excludeIds = array_merge($excludeIds, $heroSide->pluck('id')->toArray());

        $stripPosts = [];
        foreach (['strip_1', 'strip_2'] as $slotName) {
            $post = $heroSlots->get($slotName)?->post;
            if (!$post) {
                $post = Post::where('type', 'article')
                    ->tap($safeQuery)
                    ->whereNotIn('id', $excludeIds)
                    ->with('user:id,name,avatar')
                    ->inRandomOrder()
                    ->first();
            }
            if ($post) {
                $stripPosts[] = $post;
                $excludeIds[] = $post->id;
            }
        }

        $featuredSlots = $allSlots->get('featured')?->keyBy('slot_name') ?? collect();
        $editorsSlots = $allSlots->get('editors_choice')?->keyBy('slot_name') ?? collect();

        $featuredMain = $featuredSlots->get('main')?->post;
        if ($featuredMain) $excludeIds[] = $featuredMain->id;

        $featuredSubs = collect();
        for ($i = 1; $i <= 4; $i++) {
            $post = $featuredSlots->get("sub_{$i}")?->post;
            if ($post) {
                $featuredSubs->push($post);
                $excludeIds[] = $post->id;
            }
        }

        $editorsChoice = collect();
        for ($i = 1; $i <= 4; $i++) {
            $post = $editorsSlots->get((string)$i)?->post;
            if ($post) {
                $editorsChoice->push($post);
                $excludeIds[] = $post->id;
            }
        }

        $trending = Post::tap($safeQuery)
            ->whereNotIn('id', $excludeIds)
            ->with('category:id,name,slug')
            ->orderByDesc('views')
            ->take(5)
            ->get();
        $excludeIds = array_merge($excludeIds, $trending->pluck('id')->toArray());

        try {
            $ads = Advertisment::where('status', 'run')
                ->whereDate('start_date', '<=', now())
                ->whereDate('end_date', '>=', now())
                ->get()
                ->groupBy('position');
        } catch (\Exception $e) {
            $ads = collect();
        }

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
                    ->with(['user:id,name,avatar', 'category:id,name,slug'])
                    ->orderByDesc('views')
                    ->first();

                if (!$post) {
                    $post = Post::tap($safeQuery)
                        ->whereNotIn('id', $excludeIds)
                        ->with(['user:id,name,avatar', 'category:id,name,slug'])
                        ->latest()
                        ->first();
                }
            }

            if ($post) {
                $post->is_large = str_contains($slotName, 'large');
                $topStories->push($post);
                $excludeIds[] = $post->id;
            }
        }

      $entertainmentCategories = Category::whereIn('slug', ['entertainment', 'arts'])->pluck('id');

      $entertainmentPosts = collect();

      if ($entertainmentCategories->isNotEmpty()) {
          $entertainmentPosts = Post::tap($safeQuery)
              ->whereIn('category_id', $entertainmentCategories)
              ->whereNotIn('id', $excludeIds)
              ->with(['user:id,name,avatar', 'category:id,name,slug'])
              ->latest()
              ->take(6)
              ->get();

          $excludeIds = array_merge($excludeIds, $entertainmentPosts->pluck('id')->toArray());
      }
        $businessCategories = Category::whereIn('slug', ['business', 'economy', 'finance'])
            ->pluck('id');

        $businessPosts = collect();
        if ($businessCategories->isNotEmpty()) {
            $businessPosts = Post::tap($safeQuery)
                ->whereIn('category_id', $businessCategories)
                ->whereNotIn('id', $excludeIds)
                ->with(['category:id,name,slug'])
                ->latest()
                ->take(4)
                ->get();

            $excludeIds = array_merge($excludeIds, $businessPosts->pluck('id')->toArray());
        }

        $moreNewsPosts = Post::tap($safeQuery)
            ->where('type', 'news')
            ->whereNotIn('id', $excludeIds)
            ->with(['user:id,name,avatar', 'category:id,name,slug'])
            ->latest()
            ->take(8)
            ->get();

        $topics = Category::join('posts', 'categories.id', '=', 'posts.category_id')
            ->where('posts.status', 'published')
            ->where(function($q) {
                $q->where('posts.ai_verdict', '!=', 'fake')->orWhereNull('posts.ai_verdict');
            })
            ->select(
                'categories.id',
                'categories.name',
                'categories.slug'
            )
            ->selectRaw('COUNT(posts.id) as posts_count')
            ->selectRaw('MAX(posts.image) as representative_image')
            ->groupBy('categories.id', 'categories.name', 'categories.slug')
            ->havingRaw('COUNT(posts.id) > 0')
            ->orderByDesc('posts_count')
            ->take(8)
            ->get();

      $editorAlertsSlots = HomeSlot::where('section', 'editor_alerts')
          ->with(['post' => function ($query) use ($safeQuery) {
              $query->tap($safeQuery)->with(['user', 'category']);
          }])
          ->orderBy('slot_name')
          ->take(2)
          ->get()
          ->pluck('post')
          ->filter();

        $dontMissPosts = Post::tap($safeQuery)
          ->whereNotIn('id', $excludeIds)
          ->with(['user:id,name,avatar', 'category:id,name,slug'])
          ->latest()
          ->take(4)
          ->get();

      $excludeIds = array_merge($excludeIds, $dontMissPosts->pluck('id')->toArray());

      $breakingPost = Post::tap($safeQuery)
          ->where('is_breaking', true)
          ->whereNotIn('id', $excludeIds)
          ->latest()
          ->first();
      if ($breakingPost) $excludeIds[] = $breakingPost->id;

      $forYouPosts = Post::tap($safeQuery)
          ->whereNotIn('id', $excludeIds)
          ->with('category:id,name,slug')
          ->inRandomOrder()
          ->take(4)
          ->get();
      $excludeIds = array_merge($excludeIds, $forYouPosts->pluck('id')->toArray());

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'auth' => ['user' => Auth::user()],
            'ticker' => $tickerPosts,
            'hero' => [
                'main' => $heroMain,
                'side' => $heroSide,
                'trending' => $trending,
                'strip' => $stripPosts
            ],
            'featured' => [
                'main' => $featuredMain,
                'subs' => $featuredSubs,
                'editors' => $editorsChoice
            ],
            'ads' => $ads,
            'topics' => $topics,
            'topStories' => $topStories,
            'entertainment' => $entertainmentPosts,
            'business' => $businessPosts,
            'moreNews' => $moreNewsPosts,
            'gridSection' => [
            'dontMiss' => $dontMissPosts,
            'breaking' => $breakingPost,
            'forYou'   => $forYouPosts,
            ],
              'editorAlerts' => $editorAlertsSlots,
        ]);
    }
}
