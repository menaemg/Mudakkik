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
            'document' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'message' => 'nullable|string|max:1000',
        ]);

        $path = $request->file('document')->store('upgrade_requests', 'public');

        \App\Models\UpgradeRequest::create([
            'user_id' => auth()->id(),
            'status' => 'pending',
            'documents' => $path,
            'request_message' => $request->message,
        ]);

        return back()->with('success', 'تم استلام طلبك والمستندات بنجاح.');
    }
}
