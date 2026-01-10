<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\PostReport;
use App\Services\HomePageService;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $homeService = app(HomePageService::class);

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
                    'verification_badge_level' => $request->user()->currentPlan()?->features['verification_badge'] ?? null,
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

            'ticker' => \Cache::remember('global.ticker_posts', 300, function () use ($homeService) {
                return $homeService->getTickerWithSlots()->pluck('post')->filter()->values();
            }),

            'flash' => [
                'success' => fn() => $request->session()->pull('success'),
                'error'   => fn() => $request->session()->pull('error'),
                'warning' => fn() => $request->session()->pull('warning'),
                'result'  => fn() => $request->session()->get('result'),
                'open_plan_modal' => fn() => $request->session()->get('open_plan_modal'),
            ],
        ];
    }
}
