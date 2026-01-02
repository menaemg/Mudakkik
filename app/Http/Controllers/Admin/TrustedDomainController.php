<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrustedDomain;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrustedDomainController extends Controller
{
    public function index(Request $request)
    {
        $domains = TrustedDomain::latest()->get();

        return Inertia::render('Admin/Components/TrustedDomains/Index', [
            'domains' => $domains,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => [
                'required',
                'unique:trusted_domains,domain',
                'regex:/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,11}(\/[a-zA-Z0-9.-]+)*$/'
            ],
        ], [
            'domain.regex' => 'يرجى إدخال الدومين فقط (مثال: youm7.com) بدون http://',
            'domain.unique' => 'هذا الموقع مضاف بالفعل.',
            'domain.required' => 'يرجى ادخال الدومين.'
        ]);

        $domain = TrustedDomain::create([
            'name' => $validated['name'],
            'domain' => strtolower($validated['domain']),
            'is_active' => true
        ]);

        return redirect()->back()->with('success', "تم إضافة المصدر {$domain->name} بنجاح.");
    }

    public function destroy(TrustedDomain $trustedDomain)
    {
        try {
            $name = $trustedDomain->name;
            $trustedDomain->delete();
            return redirect()->back()->with('success', "تم حذف المصدر ({$name}) من القائمة الموثوقة.");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'حدث خطأ أثناء محاولة الحذف.');
        }
    }


    public function toggle(TrustedDomain $trustedDomain)
    {
        $trustedDomain->update([
            'is_active' => !$trustedDomain->is_active
        ]);

        return redirect()->back()->with('success', "تم تحديث حالة {$trustedDomain->name} بنجاح.");
    }
}
