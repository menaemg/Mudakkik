<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

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
            if (!$user) {
        abort(403, 'Unauthorized');
    }
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
        if (!$user) {
            abort(403, 'Unauthorized');
        }
        $subscriptions = $user->subscriptions()
            ->with('plan')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Subscriptions/History', [
            'subscriptions' => $subscriptions,
        ]);
    }

    /**
     * Cancel the user's current subscription.
     */
    public function cancel(): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();
        if (!$user) {
            abort(403, 'Unauthorized');
        }

        $subscription = $user->currentSubscription();

        if (!$subscription) {
            return redirect()->route('profile.edit')
                ->with('error', 'لا يوجد اشتراك نشط لإلغائه.');
        }

        // Check if it's a free plan
        if ($subscription->plan?->is_free) {
            return redirect()->route('profile.edit')
                ->with('error', 'لا يمكن إلغاء الباقة المجانية.');
        }

        // Cancel the subscription
        $cancelled = $this->paymentService->cancelSubscription($subscription);

        if (!$cancelled) {
            return redirect()->route('profile.edit')
                ->with('error', 'حدث خطأ أثناء إلغاء الاشتراك. يرجى المحاولة مرة أخرى.');
        }

        return redirect()->route('profile.edit')
            ->with('success', 'تم إلغاء اشتراكك بنجاح.');
    }
}
