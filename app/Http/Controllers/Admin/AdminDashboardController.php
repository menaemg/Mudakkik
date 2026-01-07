<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\UpgradeRequest;
use App\Models\FactCheck;
use App\Models\Plan;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $postsStats = [
            'published' => Post::where('status', 'published')->count(),
            'pending'   => Post::where('status', 'pending')->count(),
        ];

        $adsStats = [
            'approved' => \App\Models\Advertisment::where('status', 'approved')->count(),
            'pending'  => \App\Models\Advertisment::where('status', 'pending')->count(),
            'rejected' => \App\Models\Advertisment::where('status', 'rejected')->count(),
        ];

        $plansChart = Plan::withCount(['subscriptions' => fn($q) => $q->where('status', 'active')])
            ->get()
            ->map(function($plan, $index) {
                $colors = ['#3b82f6', '#8b5cf6', '#0ea5e9', '#f43f5e']; 
                return [
                    'name' => $plan->name,
                    'users' => $plan->subscriptions_count,
                    'color' => $colors[$index % count($colors)]
                ];
            });

        $checkActivity = collect(range(6, 0))->map(fn($i) => [
            'day' => now()->subDays($i)->translatedFormat('D'),
            'count' => FactCheck::whereDate('created_at', now()->subDays($i))->count(),
        ]);

        return Inertia::render('Admin/Dashboard', [
            'totalUsers' => User::count(),
            'totalPosts' => Post::count(),
            'pendingUpgrades' => UpgradeRequest::where('status', 'pending')->count(),
            'postsStats' => $postsStats,
            'adsStats' => $adsStats,
            'plansChart' => $plansChart,
            'checkActivity' => $checkActivity,
        ]);
    }
}