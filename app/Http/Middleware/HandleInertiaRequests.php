<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Post;
use App\Models\HomeSlot;
use App\Models\PostReport;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $request->user()->avatar,
                    'role' => $request->user()->role,
                    'plan_slug' => $request->user()->currentPlan()?->slug ?? 'free',
                    'is_journalist' => $request->user()->role === 'journalist',
                    'is_admin' => $request->user()->role === 'admin',
                    'credits' => [
                      'total_ai' => $request->user()->ai_recurring_credits + $request->user()->ai_bonus_credits,
                      'ads_days' => $request->user()->ad_credits,
                      ],
                    'status' => $request->user()->status ?? 'active',
                    'email_verified_at' => $request->user()->email_verified_at,
                    'notifications' => $request->user()->notifications()->limit(10)->get(),
                    'unread_notifications_count' => $request->user()->unreadNotifications()->count(),
                ] : null,
            ],

            'admin' => [
                'pendingReportsCount' => $request->user()?->role === 'admin'
                    ? \Cache::remember('admin.pending_reports_count', 60, fn() =>
                        PostReport::where('status', 'pending')->count()
                      )
                    : 0,
            ],

            'ticker' => \Cache::remember('global.ticker_posts', 300, function () {
                $safeQuery = function($query) {
                    return $query->where('status', 'published')
                                 ->where(function($q) {
                                     $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict');
                                 });
                };

                $tickerSlots = HomeSlot::with([
                    'post' => function($q) use ($safeQuery) {
                        $q->tap($safeQuery)->select('id', 'title', 'slug', 'is_breaking');
                    }
                ])->where('section', 'ticker')->get()->keyBy('slot_name');

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
                    }
                }

                return $tickerPosts;
            }),

            'flash' => [
                'success' => fn() => $request->session()->pull('success'),
                'error'   => fn() => $request->session()->pull('error'),
                'warning' => fn() => $request->session()->pull('warning'),
            ],
        ];
    }
}
