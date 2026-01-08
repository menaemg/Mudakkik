<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Category;
use App\Models\HomeSlot;
use App\Models\Advertisment;
use Illuminate\Support\Collection;

class HomePageService
{
  protected array $excludeIds = [];
  protected Collection $allSlots;

  public function __construct()
  {
    $this->allSlots = HomeSlot::with([
      'post' => function ($q) {
        $q->publishedTrusted()
          ->select('id', 'title', 'slug', 'image', 'created_at', 'category_id', 'user_id', 'views', 'is_breaking', 'type', 'status', 'ai_verdict');
      },
      'post.user:id,name,avatar',
      'post.category:id,name,slug'
    ])->get()->groupBy('section');
  }

public function getTickerWithSlots()
{
    $slots = $this->getSlotsFor('ticker');
    $tempSlots = collect();

    for ($i = 1; $i <= 5; $i++) {
        $slotKey = (string)$i;
        $manual = $slots->get($slotKey);

        if ($manual && $manual->post) {
            $tempSlots->push([
                'slot' => $slotKey,
                'type' => 'manual',
                'post' => $manual->post
            ]);
            $this->exclude($manual->post->id);
        } else {
            $tempSlots->push([
                'slot' => $slotKey,
                'type' => 'auto',
                'post' => null
            ]);
        }
    }

    $autoCount = $tempSlots->where('type', 'auto')->count();

    if ($autoCount > 0) {
        $autoPosts = Post::publishedTrusted()
            ->whereNotIn('id', $this->excludeIds)
            ->where('type', 'news')
            ->latest()
            ->take($autoCount)
            ->get();

        $autoPostIndex = 0;

        $tempSlots = $tempSlots->map(function ($item) use ($autoPosts, &$autoPostIndex) {
            if ($item['type'] === 'auto') {
                if ($autoPosts->has($autoPostIndex)) {
                    $item['post'] = $autoPosts->get($autoPostIndex);
                    $item['post']->is_auto_filled = true;
                    $autoPostIndex++;
                }
            }
            return $item;
        });
    }

    return $tempSlots->values();
}

public function getHeroWithSlots()
  {
    $slots = $this->getSlotsFor('hero');

    $main = $slots->get('main')?->post;
    if (!$main) {
      $main = Post::where('type', 'article')->publishedTrusted()
        ->with(['user', 'category'])->latest()->first();
      if ($main) $main->is_auto_filled = true;
    }
    if ($main) $this->exclude($main->id);

    $side = Post::where('type', 'news')->publishedTrusted()
      ->whereNotIn('id', $this->excludeIds)
      ->with('category')->latest()->take(4)->get();
    $this->exclude($side);

$strips = [];
    foreach (['strip_1', 'strip_2'] as $slotName) {
        $post = $slots->get($slotName)?->post;
        if (!$post) {
            $post = Post::where('type', 'article')->publishedTrusted()
                ->whereNotIn('id', $this->excludeIds)
                ->with('user')->inRandomOrder()->first();
            if ($post) $post->is_auto_filled = true;
        }
        if ($post) {
            $strips[] = $post;
            $this->exclude($post->id);
        }
    }

    $trending = Post::publishedTrusted()->whereNotIn('id', $this->excludeIds)
        ->with('category')->orderByDesc('views')->take(5)->get();
    $this->exclude($trending);

    return [
        'main' => $main,
        'side' => $side,
        'trending' => $trending,
        'strip' => array_values($strips)
    ];
}

  public function getFeaturedManual()
  {
    $fSlots = $this->getSlotsFor('featured');
    $eSlots = $this->getSlotsFor('editors_choice');

    $main = $fSlots->get('main')?->post;
    if ($main) $this->exclude($main->id);

    $subs = collect();
    for ($i = 1; $i <= 4; $i++) {
      if ($post = $fSlots->get("sub_{$i}")?->post) {
        $subs->push($post);
        $this->exclude($post->id);
      }
    }

    $editors = collect();
    for ($i = 1; $i <= 4; $i++) {
      if ($post = $eSlots->get((string)$i)?->post) {
        $editors->push($post);
        $this->exclude($post->id);
      }
    }

    return ['main' => $main, 'subs' => $subs, 'editors' => $editors];
  }

  public function getTopStoriesWithSlots()
  {
    $slotNames = ['large_1', 'large_2', 'small_1', 'small_2', 'small_3', 'small_4'];
    $slots = $this->getSlotsFor('top_stories');
    $result = collect();

    foreach ($slotNames as $name) {
      if ($post = $slots->get($name)?->post) {
        $result->put($name, $post);
        $this->exclude($post->id);
      }
    }

    $needed = count($slotNames) - $result->count();
    if ($needed > 0) {
      $auto = Post::publishedTrusted()
        ->where('type', 'article')
        ->whereNotIn('id', $this->excludeIds)
        ->where('created_at', '>=', now()->subHours(48))
        ->with(['user', 'category'])
        ->orderByDesc('views')
        ->take($needed)
        ->get();

      if ($auto->count() < $needed) {
        $extraNeeded = $needed - $auto->count();
        $extraIds = array_merge($this->excludeIds, $auto->pluck('id')->toArray());
        $older = Post::publishedTrusted()
          ->whereNotIn('id', $extraIds)
          ->with(['user', 'category'])
          ->latest()
          ->take($extraNeeded)
          ->get();
        $auto = $auto->merge($older);
      }

      $this->exclude($auto);

      foreach ($slotNames as $name) {
        if (!$result->has($name) && $auto->isNotEmpty()) {
          $post = $auto->shift();
          $post->is_auto_filled = true;
          $result->put($name, $post);
        }
      }
    }
    return $result;
  }
  public function getEntertainmentWithSlots()
  {
    $slotNames = ['main', 'vertical_1', 'vertical_2', 'side_1', 'side_2', 'side_3'];
    $slots = $this->getSlotsFor('entertainment');
    $result = collect();

    foreach ($slotNames as $name) {
      if ($post = $slots->get($name)?->post) {
        $result->put($name, $post);
        $this->exclude($post->id);
      }
    }

    $needed = count($slotNames) - $result->count();
    if ($needed > 0) {
      $auto = $this->getCategorySection(['entertainment', 'arts'], $needed);
      foreach ($slotNames as $name) {
        if (!$result->has($name) && $auto->isNotEmpty()) {
          $post = $auto->shift();
          $post->is_auto_filled = true;
          $result->put($name, $post);
        }
      }
    }
    return $result;
  }

  public function getCategorySection($slugs, $count = 6)
  {
    $cats = Category::whereIn('slug', (array)$slugs)->pluck('id');
    if ($cats->isEmpty()) return collect();

    $posts = Post::publishedTrusted()
      ->whereIn('category_id', $cats)
      ->whereNotIn('id', $this->excludeIds)
      ->with(['user:id,name,avatar', 'category:id,name,slug'])
      ->latest()
      ->take($count)
      ->get();

    $this->exclude($posts);
    return $posts;
  }

  public function getEditorAlertsManual()
  {
    return HomeSlot::where('section', 'editor_alerts')
      ->with(['post' => fn($q) => $q->publishedTrusted()->with(['user', 'category'])])
      ->orderBy('slot_name')
      ->get();
  }
  public function getTopics()
  {
    return Category::join('posts', 'categories.id', '=', 'posts.category_id')
      ->where('posts.status', 'published')
      ->where(function ($q) {
        $q->where('posts.ai_verdict', '!=', 'fake')->orWhereNull('posts.ai_verdict');
      })
      ->select('categories.id', 'categories.name', 'categories.slug')
      ->selectRaw('COUNT(posts.id) as posts_count')
      ->selectRaw('MAX(posts.image) as representative_image')
      ->groupBy('categories.id', 'categories.name', 'categories.slug')
      ->havingRaw('COUNT(posts.id) > 0')
      ->orderByDesc('posts_count')
      ->take(8)
      ->get();
  }

  public function getGridSection()
  {
    $dontMiss = Post::publishedTrusted()
      ->whereNotIn('id', $this->excludeIds)
      ->with(['user:id,name,avatar', 'category:id,name,slug'])
      ->latest()
      ->take(4)
      ->get();
    $this->exclude($dontMiss);

    $breaking = Post::publishedTrusted()
      ->where('is_breaking', true)
      ->whereNotIn('id', $this->excludeIds)
      ->latest()
      ->first();
    if ($breaking) $this->exclude($breaking->id);

    $forYou = Post::publishedTrusted()
      ->whereNotIn('id', $this->excludeIds)
      ->with('category:id,name,slug')
      ->inRandomOrder()
      ->take(4)
      ->get();
    $this->exclude($forYou);

    return [
      'dontMiss' => $dontMiss,
      'breaking' => $breaking,
      'forYou'   => $forYou
    ];
  }

  public function getBusinessWithSlots()
  {
    $slotNames = ['box_1', 'box_2', 'box_3', 'box_4'];
    $manualSlots = $this->getSlotsFor('business');
    $finalResult = collect();
    $manualCount = 0;
    foreach ($slotNames as $name) {
      if ($post = $manualSlots->get($name)?->post) {
        $finalResult->put($name, $post);
        $this->exclude($post->id);
        $manualCount++;
      }
    }
    $needed = 4 - $manualCount;

    $autoPosts = collect();
    if ($needed > 0) {
      $autoPosts = $this->getCategorySection(['business', 'economy', 'finance'], $needed);
    }

    foreach ($slotNames as $name) {
      if (!$finalResult->has($name)) {
        $post = $autoPosts->shift();
        if ($post) {
          $post->is_auto_filled = true;
          $finalResult->put($name, $post);
        }
      }
    }

    return $finalResult;
  }

  public function getBanner()
  {
    $slot = HomeSlot::where('section', 'banner')
      ->where('slot_name', 'main_banner')
      ->first();

    $type = $slot?->type ?? 'post';

    if ($type === 'post') {
      if ($slot === null) {
        return ['type' => 'post', 'data' => null];
      }
      $slot = $slot->load(['post.category', 'post.user']);
      return [
        'type' => 'post',
        'data' => $slot->post
      ];
    }

    $ad = Advertisment::where('position', 'main_banner')
      ->where('status', 'run')
      ->whereDate('start_date', '<=', now())
      ->whereDate('end_date', '>=', now())
      ->latest()
      ->first();

    return [
      'type' => 'ad',
      'data' => $ad //
    ];
  }

  public function getMoreNews()
  {
    $news = Post::publishedTrusted()
      ->where('type', 'news')
      ->whereNotIn('id', $this->excludeIds)
      ->with(['user:id,name,avatar', 'category:id,name,slug'])
      ->latest()
      ->take(8)
      ->get();

    if ($news->count() < 8) {
      $needed = 8 - $news->count();

      $currentIds = $this->excludeIds;
      $newsIds = $news->pluck('id')->toArray();
      $excludeForFallback = array_merge($currentIds, $newsIds);

      $articles = Post::publishedTrusted()
        ->where('type', 'article')
        ->whereNotIn('id', $excludeForFallback)
        ->with(['user:id,name,avatar', 'category:id,name,slug'])
        ->latest()
        ->take($needed)
        ->get();

      $news = $news->merge($articles);
    }

    return $news;
  }

public function getAds()
{
    try {
        return Advertisment::where('status', 'approved')
            ->where(function($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            })
            ->inRandomOrder()
            ->get();
    } catch (\Exception $e) {
        return collect();
    }
}
  private function getSlotsFor($section)
  {
    return $this->allSlots->get($section)?->keyBy('slot_name') ?? collect();
  }

  private function exclude($data)
  {
    if ($data instanceof Collection) {
      $this->excludeIds = array_merge($this->excludeIds, $data->pluck('id')->toArray());
    } elseif (is_object($data)) {
      $this->excludeIds[] = $data->id;
    } elseif (is_numeric($data)) {
      $this->excludeIds[] = $data;
    }
  }
}
