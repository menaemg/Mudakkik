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

            // <--- أضفنا هذا الجزء عشان العدادات
            'admin' => [
                'pendingReportsCount' => PostReport::where('status', 'pending')->count(),
            ],

            'flash' => [
                'success' => fn() => $request->session()->pull('success'),
                'error'   => fn() => $request->session()->pull('error'),
                'warning' => fn() => $request->session()->pull('warning'),
            ],
        ];
    }
}
