<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UpgradeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Notifications\JournalistApproved;

class JoinRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = UpgradeRequest::query()
            ->latest()
            ->with('user')
            ->when($request->search, function ($q, $search) {
                $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            })
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => UpgradeRequest::count(),
            'pending' => UpgradeRequest::where('status', 'pending')->count(),
            'accepted' => UpgradeRequest::where('status', 'accepted')->count(),
            'rejected' => UpgradeRequest::where('status', 'rejected')->count(),
        ];

        $oldPendingCount = UpgradeRequest::where('status', 'pending')
            ->where('created_at', '<', now()->subDays(3))
            ->count();

        return Inertia::render('Admin/Requests/Join', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
            'oldPendingCount' => $oldPendingCount,
        ]);
    }

    public function update(Request $request, UpgradeRequest $upgradeRequest)
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $data = $request->validate([
            'status' => 'required|in:accepted,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        DB::transaction(function () use ($upgradeRequest, $data) {

            $upgradeRequest->update([
                'status' => $data['status'],
                'admin_notes' => $data['admin_notes'] ?? null,
            ]);

            if ($data['status'] === 'accepted') {
                $user = $upgradeRequest->user;

                if (! $user) {
                    throw new \Exception('Associated user not found');
                }

                $user->update([
                    'role' => 'journalist',
                    'is_verified_journalist' => true,
                    'credibility_score' => 50,
                ]);

                $user->increment('ai_bonus_credits', 50);

                try {
                    $user->notify(new JournalistApproved());
                } catch (\Exception $e) {
                    \Log::error('Failed to send journalist approval notification: ' . $e->getMessage());
                }
            }
        });

        $msg = $data['status'] === 'accepted'
            ? 'تم قبول الطلب، ترقية العضو، ومنحه 50 نقطة بونص بنجاح'
            : 'تم رفض الطلب';

        return back()->with('success', $msg);
    }

    public function destroy(UpgradeRequest $upgradeRequest)
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        if (in_array($upgradeRequest->status, ['accepted', 'rejected'])) {
            return back()->with('error', 'لا يمكن حذف طلب تمت معالجته');
        }

        $upgradeRequest->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}
