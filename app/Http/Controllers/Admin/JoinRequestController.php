<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UpgreadRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JoinRequestController extends Controller
{
    //
    public function index(Request $request)
    {
        $requests = UpgreadRequest::query()
            ->latest()
            ->with('user')
            ->filter($request)
            ->paginate(10)
            ->withQueryString();

        $pendingCount = UpgreadRequest::where('status', 'pending')->count();
        $acceptedCount = UpgreadRequest::where('status', 'accepted')->count();
        $rejectedCount = UpgreadRequest::where('status', 'rejected')->count();
        $totalCount = UpgreadRequest::count();

        $oldPendingCount = UpgreadRequest::where('status', 'pending')
            ->where('created_at', '<', now()->subDays(3))
            ->count();

        return Inertia::render('Admin/Requests/Join', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => $totalCount,
                'pending' => $pendingCount,
                'accepted' => $acceptedCount,
                'rejected' => $rejectedCount,
            ],
            'oldPendingCount' => $oldPendingCount,
        ]);
    }

    public function update(Request $request, UpgreadRequest $upgreadRequest)
    {
        $data = $request->validate([
            'status' => 'required|in:accepted,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $upgreadRequest->update(
            [
                'status' => $data['status'],
                'admin_notes' => $data['admin_notes'] ?? null,
            ]
        );

        return back()->with('success', 'تم تحديث حالة الطلب بنجاح');
    }

    public function destroy(UpgreadRequest $upgreadRequest)
    {
        $upgreadRequest->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}
