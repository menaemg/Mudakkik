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
        if (!$data || !isset($data['title']) || strlen($data['title']) < 10) {
            return [];
        }

        try {
            $domains = TrustedDomain::where('is_active', true)->pluck('domain')->toArray();
            if (empty($domains)) {
                Log::warning("No trusted domains found in database.");
                return [];
            }

            $response = Http::timeout(20)->post('https://api.tavily.com/search', [
                'api_key' => env('TAVILY_API_KEY'),
                'query'   => $data['title'],
                'search_depth' => 'advanced',
                'include_domains' => $domains,
                'max_results' => 5
            ]);

            if ($response->successful()) {
                $results = $response->json()['results'] ?? [];
                return collect($results)->filter(function ($result) use ($domains) {
                    foreach ($domains as $domain) {
                        if (str_contains($result['url'], $domain)) {
                            return true;
                        }
                    }
                    return false;
                })->values()->all();
            }

            return [];
        } catch (\Exception $e) {
            Log::error("Tavily Search Error: " . $e->getMessage());
            return [];
        }
    }
    private function finalVerdict($originalNews, $searchResults)
    {
        if (empty($searchResults)) {
            return [
                'rating' => 'غير مؤكد',
                'percentage' => 0,
                'explanation' => 'لم نجد نتائج مطابقة في المصادر الموثوقة حالياً.',
                'evidence' => ''
            ];
        }

        try {
            $snippets = collect($searchResults)->map(fn($i) => [
                'title' => $i['title'],
                'content' => mb_substr($i['content'], 0, 1000)
            ])->toArray();

            $response = Http::withHeaders(['Authorization' => 'Bearer ' . env('GROQ_API_KEY')])
                ->timeout(45)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        ['role' => 'system', 'content' => 'أنت خبير تدقيق جنائي للأخبار والروابط.
                مهمتك الأولى هي تحديد ما إذا كانت نتائج البحث "مرتبطة سياقياً" بالادعاء أم لا.
                
                قواعد صارمة للحكم:
                1. إذا كانت النتائج لا تتعلق بالموضوع: الرد {"rating": "غير مؤكد", "percentage": 0, ...}.
                2. بناءً على نسبة ثقتك، اختر المسمى الصحيح:
                   - أقل من 50%: "غير صحيح"
                   - من 50% لـ 70%: "غير مؤكد"
                   - من 70% لـ 90%: "صحيح"
                   - أعلى من 90%: "رسمي"
                3. اذكر الاقتباس الذي أكد أو نفى الخبر في حقل evidence.
                
                رد بـ JSON فقط بنفس هذا التنسيق.'],
                        ['role' => 'user', 'content' => "الادعاء المراد فحصه: " . $originalNews['title'] . "\n\nالمصادر المتاحة للتحليل:\n" . json_encode($snippets)]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.1,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return json_decode($data['choices'][0]['message']['content'], true);
            }

            $fallbackExplanation = !empty($searchResults)
                ? "بناءً على المصادر المتاحة: " . mb_substr($searchResults[0]['content'], 0, 150) . "..."
                : 'لم نجد تفاصيل كافية في المصادر الموثوقة.';

            return [
                'rating' => 'غير مؤكد',
                'percentage' => 55,
                'explanation' => $fallbackExplanation,
                'evidence' => $searchResults[0]['title'] ?? ''
            ];
        } catch (\Exception $e) {
            return [
                'rating' => 'غير مؤكد',
                'percentage' => 50,
                'explanation' => "تعذر الربط التلقائي، والمصادر تشير إلى: " . ($searchResults[0]['title'] ?? 'أخبار متعلقة'),
                'evidence' => ''
            ];
        }
    }
    public function check($input)
    {
        $inputHash = md5(trim(mb_strtolower($input)));
        $existingCheck = \App\Models\FactCheck::where('hash', $inputHash)->first();
        if ($existingCheck) {
            return [
                'status' => 'Fetched from Cache',
                'verdict' => [
                    'label' => $existingCheck->label,
                    'confidence' => $existingCheck->confidence . "%",
                    'summary' => $existingCheck->summary,
                    'evidence' => $existingCheck->evidence,
                ],
                'sources' => $existingCheck->sources
            ];
        }


        $processed = $this->identifyInputType($input);
        $raw = $processed['content'];
        $isFallback = ($raw === "FAILED_CONTENT");

        if ($isFallback) {
            $raw = "عنوان الخبر من الرابط: " . $this->extractTitleFromUrl($input);
        }

        $data = $this->refineContentForSearch($raw, $isFallback);
        if (!$data || $data['title'] === "INVALID") {
            return ['status' => 'error', 'message' => 'محتوى غير مفهوم'];
        }

        $results = $this->searchInTrustedSources($data);
        $verdict = $this->finalVerdict($data, $results);

        $searchScore = collect($results)->avg('score') * 100;
        $finalConfidence = round(($verdict['percentage'] + $searchScore) / 2);


        $newRecord = \App\Models\FactCheck::create([
            'hash'        => $inputHash,
            'input_text'  => $input,
            'label'       => $verdict['rating'] ?? 'غير مؤكد',
            'confidence'  => (int)$finalConfidence,
            'summary'     => $verdict['explanation'] ?? 'فشل التحليل',
            'evidence'    => $verdict['evidence'] ?? '',
            'sources'     => collect($results)->take(3)->map(fn($r) => [
                'title' => $r['title'],
                'url' => $r['url']
            ])->toArray()
        ]);

        return [
            'status' => 'New Fact-Check Completed',
            'verdict' => [
                'label' => $newRecord->label,
                'confidence' => $newRecord->confidence . "%",
                'summary' => $newRecord->summary,
                'evidence' => $newRecord->evidence,
            ],
            'sources' => $newRecord->sources
        ];
    }
    private function identifyInputType($input)
    {
        if (filter_var($input, FILTER_VALIDATE_URL)) {
            return ['type' => 'url', 'content' => $this->fetchUrlContent($input)];
        }
        return ['type' => 'text', 'content' => mb_substr($input, 0, 2000)];
    }

    private function extractTitleFromUrl($url)
    {
        $path = parse_url($url, PHP_URL_PATH);
        $title = str_replace(['-', '_', '/', '.html'], ' ', urldecode(basename($path)));
        return (is_numeric($title) || strlen($title) < 5) ? "INVALID" : $title;
    }
}
