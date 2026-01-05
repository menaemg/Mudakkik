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
            'content' => 'required|string|min:10',
        ]);

        try {
            $input = $request->input('content');
            $result = $this->service->check($input);
            return response()->json($result);
        } catch (\Exception $e) {
            report($e);

            return response()->json([
                'status' => 'error',
                'message' => 'عذراً، حدث خطأ فني. يرجى المحاولة مرة أخرى لاحقاً.'
            ], 500);
        }
    }

}
