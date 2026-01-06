<?php

namespace App\Http\Controllers;

use App\Models\UpgradeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpgradeRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'request_message' => 'required|string|min:10',
            'documents' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $path = null;
        if ($request->hasFile('documents')) {
            $path = $request->file('documents')->store('upgrade_requests', 'public');
        }

        $existingRequest = UpgradeRequest::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
             return back()->with('error', 'لديك طلب قيد المراجعة بالفعل.');
        }

        UpgradeRequest::create([
            'user_id' => Auth::id(),
            'request_message' => $request->request_message,
            'documents' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'تم إرسال طلب الانضمام بنجاح.');
    }
}
