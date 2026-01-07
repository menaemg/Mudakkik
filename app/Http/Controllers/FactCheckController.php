<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FactCheckServices;
use App\Models\FactCheck;

class FactCheckController extends Controller
{
    protected $service;

    public function __construct(FactCheckServices $service)
    {
        $this->service = $service;
    }

    public function verify(Request $request, FactCheckServices $service)
    {
        $request->validate([
            'text' => 'required|string|min:10|max:5000',
            'period' => 'nullable|integer|in:1,3,7,30,365',
        ]);

        $user = $request->user();

        if ($user) {
            if (!$user->consumeAiCredit(1)) {
                return back()->with([
                    'error' => 'لقد استنفدت رصيد كاشف الحقائق لهذا الشهر. يرجى الترقية للمتابعة.',
                    'open_plan_modal' => true
                ]);
            }
        } else {
             return back()->with('error', 'يجب تسجيل الدخول لاستخدام هذه الميزة.');
        }

        $result = $service->check($request->text, $request->period, $user?->id);

        if (isset($result['status']) && $result['status'] === 'error') {
            if ($user) {
                $user->increment('ai_recurring_credits');
                $user->refresh();
            }
            return back()->with('error', 'حدث خطأ تقني أثناء التحليل، لم يتم خصم الرصيد.');
        }

        if ($user) {
            $user->refresh();
        }

        return back()->with([
            'result' => $result,
            'new_credits' => $user ? ($user->ai_recurring_credits + $user->ai_bonus_credits) : 0
        ]);
    }

    public function history()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $history = auth()->user()->factChecks()->latest('fact_check_user.created_at')->take(10)->get();
        return response()->json($history);
    }

    public function show(FactCheck $factCheck)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Verify the user is associated with this fact check
        $exists = auth()->user()->factChecks()->where('fact_checks.id', $factCheck->id)->exists();

        if (!$exists) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'verdict' => [
                'label' => $factCheck->label,
                'confidence' => $factCheck->confidence,
                'summary' => $factCheck->summary,
                'evidence' => $factCheck->evidence,
            ],
            'sources' => $factCheck->sources,
            'input_text' => $factCheck->input_text,
            'period' => $factCheck->period,
        ]);
    }
}
