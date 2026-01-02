<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\TrustedDomain;

class FactCheckServices
{
    private function fetchUrlContent($url)
    {
        try {
            $response = Http::withoutVerifying()
                ->retry(2, 500)
                ->timeout(15)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                ])
                ->get("https://r.jina.ai/" . urlencode($url));

            if ($response->successful()) {
                $body = $response->body();
              
                return (strlen($body) < 150) ? "FAILED_CONTENT" : mb_substr($body, 0, 2000);
            }
            return "FAILED_CONTENT";
        } catch (\Exception $e) {
            return "FAILED_CONTENT";
        }
    }

    private function refineContentForSearch($rawContent, $isFallback = false)
    {
        $prompt = $isFallback 
            ? 'حلل الرابط المستخرج. استخرج عنواناً واضحاً باللغة العربية. إذا كان النص غير مفهوم رد بـ "INVALID". رد بـ JSON: {"title": "..", "body": "..", "keywords": ".."}'
            : 'أنت خبير فحص حقائق. استخرج عنوان الخبر والكلمات المفتاحية. إذا كان النص عبارة عن رموز غير مفهومة، اجعل العنوان "INVALID". رد بـ JSON: {"title": "..", "body": "..", "keywords": ".." }';

        try {
            $response = Http::withHeaders(['Authorization' => 'Bearer ' . env('GROQ_API_KEY')])
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        ['role' => 'system', 'content' => $prompt],
                        ['role' => 'user', 'content' => $rawContent]
                    ],
                    'response_format' => ['type' => 'json_object'],
                ]);

            return json_decode($response->json()['choices'][0]['message']['content'], true);
        } catch (\Exception $e) {
            return null;
        }
    }


    private function searchInTrustedSources($data)
    {

        if (!$data || $data['title'] === "INVALID" || strlen($data['title']) < 5) {
            return [];
        }

        try {
            $domains = TrustedDomain::where('is_active', true)->pluck('domain')->toArray();
            
            $response = Http::post('https://api.tavily.com/search', [
                'api_key' => env('TAVILY_API_KEY'),
                'query' => $data['title'],
                'search_depth' => 'advanced',
                'include_domains' => $domains,
                'max_results' => 5
            ]);

            return $response->json()['results'] ?? [];
        } catch (\Exception $e) {
            return [];
        }
    }


private function finalVerdict($originalNews, $searchResults)
{
    if (empty($searchResults)) {
        return ['rating' => 'غير مؤكد', 'percentage' => 0, 'explanation' => 'لا توجد مصادر.', 'evidence' => ''];
    }

    try {
        $snippets = collect($searchResults)->map(fn($i) => [
            'title' => $i['title'],
            'content' => mb_substr($i['content'], 0, 400)
        ])->toArray();

        $response = Http::withHeaders(['Authorization' => 'Bearer ' . env('GROQ_API_KEY')])
            ->timeout(60)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.1-8b-instant',
                'messages' => [
                    ['role' => 'system', 'content' => 'أنت مدقق حقائق. قارن الخبر بالنتائج. رد بـ JSON فقط: {"rating": "..", "percentage": 0-100, "explanation": "..", "evidence": ".."}. إذا كان الخبر عن وفاة قديمة مؤكدة (مثل مبارك)، فالتقييم "صحيح".'],
                    ['role' => 'user', 'content' => "الخبر: " . $originalNews['title'] . "\nالنتائج: " . json_encode($snippets)]
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0, 
            ]);

        if ($response->successful()) {
            $data = $response->json();
            return json_decode($data['choices'][0]['message']['content'], true);
        }
        return [
            'rating' => 'تنبيه',
            'percentage' => 50,
            'explanation' => 'النتائج موجودة ولكن محرك التحليل مزدحم حالياً. يرجى مراجعة الروابط أدناه.',
            'evidence' => 'المصادر المرفقة تؤكد/تنفي الخبر تاريخياً.'
        ];

    } catch (\Exception $e) {
        return ['rating' => 'تحليل يدوي', 'percentage' => 50, 'explanation' => 'يرجى التأكد من الروابط، المحرك يواجه ضغطاً.', 'evidence' => ''];
    }
}
    public function check($input)
    {
        $processed = $this->identifyInputType($input);
        $raw = $processed['content'];
        $isFallback = ($raw === "FAILED_CONTENT");

        if ($isFallback) {
            $raw = "عنوان الخبر من الرابط: " . $this->extractTitleFromUrl($input);
        }

        $data = $this->refineContentForSearch($raw, $isFallback);
        if (!$data || $data['title'] === "INVALID") {
             dd(['status' => 'error', 'message' => 'تعذر فهم محتوى النص أو الرابط، يرجى إدخال نص واضح.']);
        }

        $results = $this->searchInTrustedSources($data);
        $verdict = $this->finalVerdict($data, $results);

        $searchScore = collect($results)->avg('score') * 100;
        $finalConfidence = ($verdict['percentage'] + $searchScore) / 2;

        dd([
            'status' => 'Fact-Check Completed',
            'verdict' => [
                'label' => $verdict['rating'],
                'confidence' => round($finalConfidence) . "%",
                'summary' => $verdict['explanation'],
                'evidence' => $verdict['evidence'],
            ],
            'original_data' => [
                'title' => $data['title'],
                'method' => $isFallback ? 'URL Slug' : 'Content Extraction'
            ],
            'sources' => collect($results)->take(3)->map(fn($r) => ['title' => $r['title'], 'url' => $r['url']])
        ]);
    }

    private function identifyInputType($input) {
        if (filter_var($input, FILTER_VALIDATE_URL)) {
            return ['type' => 'url', 'content' => $this->fetchUrlContent($input)];
        }
        return ['type' => 'text', 'content' => mb_substr($input, 0, 2000)];
    }

    private function extractTitleFromUrl($url) {
        $path = parse_url($url, PHP_URL_PATH);
        $title = str_replace(['-', '_', '/', '.html'], ' ', urldecode(basename($path)));
        return (is_numeric($title) || strlen($title) < 5) ? "INVALID" : $title;
    }
}