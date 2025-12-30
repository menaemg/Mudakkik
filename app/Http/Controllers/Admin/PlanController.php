<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePlanRequest;
use App\Http\Requests\Admin\UpdatePlanRequest;
use App\Models\Plan;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::ordered()->paginate(10);

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

    public function store(StorePlanRequest $request)
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);
        $validated['is_free'] = $validated['is_free'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

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

    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        $plan->update($request->validated());

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