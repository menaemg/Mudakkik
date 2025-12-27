<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = Subscription::with(['user', 'plan'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->plan_id, fn($q, $planId) => $q->where('plan_id', $planId))
            ->latest()
            ->paginate(15);

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
        $plans = Plan::active()->ordered()->get();

        return Inertia::render('Admin/Subscriptions/Edit', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    public function update(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,cancelled,expired,past_due',
            'plan_id' => 'required|exists:plans,id',
            'ends_at' => 'nullable|date',
            'auto_renew' => 'boolean',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $subscription->update($validated);

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'تم تحديث الاشتراك بنجاح');
    }
}
