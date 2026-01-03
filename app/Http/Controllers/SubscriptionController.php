<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * Display available plans.
     */
    public function index(): Response
    {
        $plans = Plan::active()->paid()->ordered()->get();

        $user = Auth::user();
        $currentSubscription = $user ? $user->currentSubscription()?->load('plan') : null;

        return Inertia::render('Subscriptions/Plans', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'isLoggedIn' => (bool) $user,
        ]);
    }

    /**
     * Display user's subscription details.
     */
    public function show(): Response
    {
        $user = Auth::user();
        $subscription = $user->currentSubscription()?->load('plan');

        $history = $user->subscriptions()
            ->with('plan')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Subscriptions/Show', [
            'subscription' => $subscription,
            'history' => $history,
        ]);
    }

    /**
     * Display subscription history.
     */
    public function history(): Response
    {
        $user = Auth::user();

        $subscriptions = $user->subscriptions()
            ->with('plan')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Subscriptions/History', [
            'subscriptions' => $subscriptions,
        ]);
    }
}
