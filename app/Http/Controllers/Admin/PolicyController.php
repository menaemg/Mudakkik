<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PolicyController extends Controller
{
  
    public function index(Request $request)
    {
        $policies = Policy::latest()
            ->when($request->search, function ($query, $search) {
                $query->where('type', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Components/Policies/Index', [
            'policies' => $policies,
            'filters' => $request->only(['search'])
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|unique:policies,type',
            'content' => 'required|string',
        ]);

        $policy = Policy::create($validated);

        return redirect()->back()->with('success', "تم إنشاء السياسة ({$policy->type}) بنجاح.");
    }

   
    public function update(Request $request, Policy $policy)
    {
        $validated = $request->validate([
            'type' => 'required|string|unique:policies,type,' . $policy->id,
            'content' => 'required|string',
        ]);

        $policy->update($validated);

        return redirect()->back()->with('success', "تم تحديث السياسة ({$policy->type}) بنجاح.");
    }


    public function destroy(Policy $policy)
    {
        try {
            $typeName = $policy->type;
            $policy->delete();
            return redirect()->back()->with('success', "تم حذف السياسة ({$typeName}) بنجاح.");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'حدث خطأ أثناء محاولة الحذف.');
        }
    }
}