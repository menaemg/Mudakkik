<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSubscriptionRequest;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = Subscription::with(['user', 'plan'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->plan_id, fn($q, $planId) => $q->where('plan_id', $planId))
            ->latest()
            ->paginate(10);

        $plans = Plan::active()->ordered()->get();

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'plans' => $plans,
            'filters' => $request->only(['status', 'plan_id']),
        ]);
    }

    public function edit(Subscription $subscription)
    {
        $subscription->load(['user', 'plan']);

        // Include current plan even if inactive + all active plans
        $plans = Plan::query()
            ->where('is_active', true)
            ->orWhere('id', $subscription->plan_id)
            ->ordered()
            ->distinct()
            ->get();

        return Inertia::render('Admin/Subscriptions/Edit', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    public function update(UpdateSubscriptionRequest $request, Subscription $subscription)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($subscription, $validated) {
            $oldStatus = $subscription->status;
            $newStatus = $validated['status'];

            // Handle status change with model methods
            if ($oldStatus !== $newStatus) {
                if ($newStatus === 'cancelled') {
                    // Use model's cancel method to set cancelled_at
                    $subscription->cancel();
                    // Remove status from validated to avoid overwriting
                    unset($validated['status']);
                } elseif ($newStatus === 'active' && $oldStatus === 'cancelled') {
                    // Reactivating: clear cancelled_at
                    $validated['cancelled_at'] = null;
                }
            }

            // Update remaining attributes
            $subscription->update($validated);
        });

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'تم تحديث الاشتراك بنجاح');
    }
}
