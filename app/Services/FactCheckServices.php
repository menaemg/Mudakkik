<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FactCheckServices
{
    protected $trustedDomains = [
        'youm7.com', 'masrawy.com', 'shorouknews.com', 
        'alarabiya.net', 'skynewsarabia.com', 'aljazeera.net',
        'reuters.com', 'bbc.com/arabic', 'afp.com','ahram.org.eg'
    ];

    public function check($input) {
        $query = $this->isUrl($input) ? $this->extractTextFromUrl($input) : $input;
        
        $searchQuery = $this->refineQueryWithAI($query);

        $sources = $this->searchTavily($searchQuery);

        if (empty($sources)) {
            return [
                'verdict' => 'غير مؤكد',
                'confidence_score' => 0,
                'explanation' => 'لم نجد تفاصيل كافية في المصادر الموثوقة المحددة بعد فحص الرابط.',
                'sources' => []
            ];
        }

        return $this->analyzeWithAI($query, $sources);
    }

    private function isUrl($input) {
        return filter_var($input, FILTER_VALIDATE_URL);
    }

    private function extractTextFromUrl($url) {
        try {
            $response = Http::withHeaders([
                'X-Return-Format' => 'text'
            ])->get("https://r.jina.ai/" . $url);

            if ($response->successful()) {
                return mb_substr($response->body(), 0, 3000);
            }
        } catch (\Exception $e) {
            Log::error("Jina Extraction Error: " . $e->getMessage());
        }
        return $url;
    }

    private function refineQueryWithAI($text) {
        if (strlen($text) < 50) return $text;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => 'أنت مستخرج أخبار. أعطني جملة واحدة فقط مختصرة تمثل صلب الخبر للبحث عنها، بدون مقدمات أو شرح.'],
                ['role' => 'user', 'content' => "استخرج ملخص للبحث: " . mb_substr($text, 0, 1500)]
            ]
        ]);

        return $response->json()['choices'][0]['message']['content'] ?? mb_substr($text, 0, 100);
    }

    private function searchTavily($query) {
        $response = Http::post('https://api.tavily.com/search', [
            'api_key' => env('TAVILY_API_KEY'),
            'query' => $query,
            'include_domains' => $this->trustedDomains,
            'max_results' => 5
        ]);
        return $response->json()['results'] ?? [];
    }

    private function analyzeWithAI($query, $sources) {
        $context = "";
        foreach ($sources as $s) {
            $context .= "المصدر: {$s['title']} \n المحتوى: {$s['content']} \n\n";
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => 'أنت خبير تدقيق حقائق. رد بتنسيق JSON فقط يحتوي على الحقول: "verdict", "confidence_score", "explanation". النسبة يجب أن تكون رقماً.'],
                ['role' => 'user', 'content' => "الخبر: $query \n\n المصادر: \n $context"]
            ],
            'response_format' => ['type' => 'json_object']
        ]);

        $rawJson = $response->json()['choices'][0]['message']['content'] ?? '{}';
        $result = json_decode($rawJson, true);

        return [
            'verdict' => $result['verdict'] ?? 'غير مؤكد',
            'confidence_score' => $result['confidence_score']*100 ?? 0,
            'explanation' => $result['explanation'] ?? 'فشل التحليل.',
            'sources' => $sources
        ];
    }
}