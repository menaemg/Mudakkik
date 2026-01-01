<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrustedDomain;
use Illuminate\Http\Request;

class TrustedDomainController extends Controller
{

    public function index()
    {
        $domains = TrustedDomain::orderBy('created_at', 'desc')->get();
        return view('admin.trusted_domains.index', compact('domains'));
    }
    public function store(Request $request)
    {
        $request->validate([
            'domain' => 'required|unique:trusted_domains,domain|regex:/^(?!https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,11}$/',
            'name' => 'required|string|max:255',
        ], [
            'domain.regex' => 'يرجى إدخال الدومين فقط (مثال: youm7.com) بدون http://',
            'domain.unique' => 'هذا الموقع مضاف بالفعل.'
        ]);

        TrustedDomain::create([
            'domain' => strtolower($request->domain),
            'name' => $request->name,
            'is_active' => true
        ]);

        return redirect()->back()->with('success', 'تم إضافة الموقع بنجاح');
    }

    public function destroy($id)
    {
        $domain = TrustedDomain::findOrFail($id);
        $domain->delete();

        return redirect()->back()->with('success', 'تم حذف الموقع من القائمة الموثوقة');
    }

    public function toggle($id)
    {
        $domain = TrustedDomain::findOrFail($id);
        $domain->is_active = !$domain->is_active;
        $domain->save();

        return redirect()->back()->with('success', 'تم تحديث حالة الموقع');
    }
}
