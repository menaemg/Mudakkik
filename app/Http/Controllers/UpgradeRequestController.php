<?php

namespace App\Http\Controllers;

use App\Models\UpgradeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UpgradeRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'request_message' => 'required|string|min:10',
            'documents' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        try {
            \DB::transaction(function () use ($request) {
                $existingRequest = UpgradeRequest::where('user_id', Auth::id())
                    ->where('status', 'pending')
                    ->lockForUpdate()
                    ->first();

                if ($existingRequest) {
                    throw new \Exception('pending_request_exists');
                }

                $path = null;
                if ($request->hasFile('documents')) {
                    $path = $request->file('documents')->store('upgrade_requests', 'public');
                }

                UpgradeRequest::create([
                    'user_id' => Auth::id(),
                    'request_message' => $request->request_message,
                    'documents' => $path,
                    'status' => 'pending',
                ]);

                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    $admin->notify(new \App\Notifications\AdminActivityNotification([
                        'title' => 'طلب انضمام جديد',
                        'message' => 'قدم ' . auth()->user()->name . ' طلباً للترقية إلى صحفي.',
                        'link' => route('admin.requests.join'), 
                        'type' => 'upgrade_request'
                    ]));
                }
            });
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()->with('error', 'لديك طلب قيد المراجعة بالفعل.');
            }
            throw $e;
        } catch (\Exception $e) {
            if ($e->getMessage() === 'pending_request_exists') {
                return back()->with('error', 'لديك طلب قيد المراجعة بالفعل.');
            }
            throw $e;
        }

        return back()->with('success', 'تم إرسال طلب الانضمام بنجاح.');
    }
}
