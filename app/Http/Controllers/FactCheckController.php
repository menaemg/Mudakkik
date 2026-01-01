<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FactCheckServices;
use App\Models\FactCheck;
use Illuminate\Support\Facades\Auth;

class FactCheckController extends Controller

{

    protected $factService;



    public function __construct(FactCheckServices $factService)

    {

        $this->factService = $factService;
    }



    public function verify(Request $request)

    {
        $data = $request->validate([

            'content' => 'required|string|min:10'

        ]);

        try {

            $result = $this->factService->check($request->input('content'));
            FactCheck::create([

                'user_input'       => $request->input('content'),

                'verdict'          => $result['verdict'] ?? 'غير مؤكد',

                'confidence_score' => $result['confidence_score'] ?? 0,

                'ai_explantion'   => $result['explanation'] ?? 'فشل التحليل',

                'evidence_sources' => $result['sources'] ?? [],

                'user_id'          => Auth::id(),

            ]);



            return response()->json($result);
        } catch (\Exception $e) {

            return response()->json([

                'error' => 'حدث خطأ: ' . $e->getMessage()

            ], 500);
        }
    }
}
