<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::ordered()->get();

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Plans/Form', [
            'plan' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_interval' => 'required|in:monthly,yearly,one_time',
            'duration_days' => 'nullable|integer|min:1',
            'is_free' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'features' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);
        $validated['is_free'] = $validated['is_free'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;

        Plan::create($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'تم إنشاء الخطة بنجاح');
    }

    public function edit(Plan $plan)
    {
        return Inertia::render('Admin/Plans/Form', [
            'plan' => $plan,
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_interval' => 'required|in:monthly,yearly,one_time',
            'duration_days' => 'nullable|integer|min:1',
            'is_free' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'features' => 'nullable|array',
        ]);

        $plan->update($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'تم تحديث الخطة بنجاح');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->subscriptions()->exists()) {
            return back()->with('error', 'لا يمكن حذف خطة لها اشتراكات');
        }

        $plan->delete();

        return redirect()->route('admin.plans.index')
            ->with('success', 'تم حذف الخطة بنجاح');
    }
}
