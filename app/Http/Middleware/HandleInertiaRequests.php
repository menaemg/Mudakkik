<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\PostReport; // <--- أضفنا هذا السطر

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
                    'notifications' => $request->user()->notifications()->limit(10)->get(),
                    'unread_notifications_count' => $request->user()->unreadNotifications()->count(),
                ] : null,
            ],

            // Admin counters - only computed for admin users with caching
            'admin' => [
                'pendingReportsCount' => $request->user()?->role === 'admin'
                    ? \Cache::remember('admin.pending_reports_count', 60, fn() =>
                        PostReport::where('status', 'pending')->count()
                      )
                    : 0,
            ],

            'flash' => [
                'success' => fn() => $request->session()->pull('success'),
                'error'   => fn() => $request->session()->pull('error'),
                'warning' => fn() => $request->session()->pull('warning'),
            ],
        ];
    }
}
