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

    public function verify(Request $request)
    {
        $request->validate([
            'text' => 'required|string|min:10|max:5000',
            'period' => 'nullable|integer|in:1,3,7,30,365',
        ]);

        $user = $request->user();

        if ($user) {
            $creditType = $user->consumeAiCredit(1);
            if (!$creditType) {
                return back()->with([
                    'error' => 'لقد استنفدت رصيد مختبر الحقيقة لهذا الشهر. يرجى الترقية للمتابعة.',
                    'open_plan_modal' => true
                ]);
            }
        } else {
             return back()->with('error', 'يجب تسجيل الدخول لاستخدام هذه الميزة.');
        }

        $result = $this->service->check($request->text, $request->period, $user?->id);

        if (isset($result['status']) && $result['status'] === 'error') {
            if ($user) {
                $user->refundAiCredit(1, $creditType);
            }
            
            $errorMessage = $result['message'] ?? 'حدث خطأ تقني أثناء التحليل، لم يتم خصم الرصيد.';
            return back()->with('error', $errorMessage);
        }

        if ($user) {
            $user->refresh();
        }

        return back()->with([
            'result' => $result,
            'new_credits' => $user ? ($user->ai_recurring_credits + $user->ai_bonus_credits) : 0
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'text' => 'required|string|min:10|max:5000',
            'period' => 'nullable|integer|in:1,3,7,30,365',
        ]);

        $user = $request->user();

        if ($user) {
            $creditType = $user->consumeAiCredit(1); 
            if (!$creditType) {
                return back()->with([
                    'error' => 'لقد استنفدت رصيد مختبر الحقيقة لهذا الشهر. يرجى الترقية للمتابعة.',
                    'open_plan_modal' => true
                ]);
            }
        } else {
             return back()->with('error', 'يجب تسجيل الدخول لاستخدام هذه الميزة.');
        }

        $result = $this->service->search($request->text, $request->period, $user?->id);

        if (isset($result['status']) && $result['status'] === 'error') {
            if ($user) {
                $user->refundAiCredit(1, $creditType);
            }
            
            $errorMessage = $result['message'] ?? 'حدث خطأ تقني أثناء البحث، لم يتم خصم الرصيد.';
            return back()->with('error', $errorMessage);
        }

        if ($user) {
            $user->refresh();
        }

        return back()->with([
            'result' => $result,
            'new_credits' => $user ? ($user->ai_recurring_credits + $user->ai_bonus_credits) : 0
        ]);
    }

    /**
     * API endpoint that returns JSON response.
     */
    public function verifyApi(Request $request)
    {
        $request->validate([
            'text' => 'required|string|min:10|max:5000',
            'period' => 'nullable|integer|in:1,3,7,30,365',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'يجب تسجيل الدخول لاستخدام هذه الميزة.'], 401);
        }

        $creditType = $user->consumeAiCredit(1);
        if (!$creditType) {
            return response()->json([
                'error' => 'لقد استنفدت رصيد مختبر الحقيقة لهذا الشهر. يرجى الترقية للمتابعة.',
                'open_plan_modal' => true
            ], 402);
        }

        $result = $this->service->check($request->text, $request->period, $user->id);

        if (isset($result['status']) && $result['status'] === 'error') {
            $user->refundAiCredit(1, $creditType);
            
            $errorMessage = $result['message'] ?? 'حدث خطأ تقني أثناء التحليل، لم يتم خصم الرصيد.';
            return response()->json(['error' => $errorMessage], 400);
        }

        $user->refresh();

        return response()->json([
            'success' => true,
            'result' => $result,
            'new_credits' => $user->ai_recurring_credits + $user->ai_bonus_credits
        ]);
    }

    public function history()
    {
        $history = auth()->user()->factChecks()->latest('fact_check_user.created_at')->take(10)->get();
        return response()->json($history);
    }

    public function show(FactCheck $factCheck)
    {
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
            'type' => $factCheck->type ?? 'verify'
        ]);
    }
}
