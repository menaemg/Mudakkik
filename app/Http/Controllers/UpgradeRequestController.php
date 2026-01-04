<?php

namespace App\Http\Controllers;

use App\Models\UpgradeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class UpgradeRequestController extends Controller
{
    public function store(Request $request)
    {
        $key = 'upgrade_request:' . auth()->id();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'message' => "عفواً، لقد تجاوزت حد المحاولات. يرجى الانتظار {$seconds} ثانية.",
            ]);
        }

        RateLimiter::hit($key, 60);

        $request->validate([
            'document' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'message' => 'nullable|string|max:1000',
        ]);

        $path = $request->file('document')->store('upgrade_requests', 'public');

        UpgradeRequest::create([
            'user_id' => auth()->id(),
            'status' => 'pending',
            'documents' => $path,
            'request_message' => $request->message,
        ]);

        return back()->with('success', 'تم استلام طلبك والمستندات بنجاح.');
    }
}
