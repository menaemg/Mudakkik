<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\UpgradeRequest;
use App\Models\FactCheck;
use App\Models\Plan;
use App\Models\Advertisment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $postsStats = [
            'published' => Post::where('status', 'published')->count(),
            'pending'   => Post::where('status', 'pending')->count(),
        ];

        $adsStats = [
            'approved' => Advertisment::where('status', 'approved')->count(),
            'pending'  => Advertisment::where('status', 'pending')->count(),
            'rejected' => Advertisment::where('status', 'rejected')->count(),
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

        // التعديل المقترح لتحسين الأداء: استعلام واحد بدلاً من 7
        $startDate = now()->subDays(6)->startOfDay();
        $counts = FactCheck::where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->pluck('count', 'date');

        $checkActivity = collect(range(6, 0))->map(fn($i) => [
            'day' => now()->subDays($i)->translatedFormat('D'),
            'count' => $counts[now()->subDays($i)->toDateString()] ?? 0,
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