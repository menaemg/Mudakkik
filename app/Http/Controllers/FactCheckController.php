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

        $result = $service->check($request->text);

        if (isset($result['status']) && $result['status'] === 'error') {
            if ($user) {
                $user->increment('ai_recurring_credits');
            }
            return back()->with('error', 'حدث خطأ تقني أثناء التحليل، لم يتم خصم الرصيد.');
        }

        return back()->with([
            'result' => $result,
            'new_credits' => $user ? ($user->ai_recurring_credits + $user->ai_bonus_credits) : 0
        ]);
    }

    public function history()
    {
        $history = FactCheck::latest()->take(10)->get();
        return response()->json($history);
    }
}
