<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\TrustedDomain;


class FactCheckServices
{
    private const PRIMARY_MODEL = 'llama-3.3-70b-versatile'; 
    private const FAST_MODEL = 'llama-3.1-8b-instant';
    private const VERIFY_SOURCE_LIMIT = 5;
    private const SEARCH_SOURCE_LIMIT = 10;

    private function fetchUrlContent(string $url): string
    {
        try {
            $response = Http::withoutVerifying()
                ->retry(2, 500)
                ->timeout(15)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language' => 'ar,en;q=0.9',
                ])
                ->get("https://r.jina.ai/" . urlencode($url));

            if ($response->successful()) {
                $body = $response->body();
                return (strlen($body) < 10) ? "FAILED_CONTENT" : mb_substr($body, 0, 3000);
            }
            return "FAILED_CONTENT";
        } catch (\Exception $e) {
            Log::warning('Failed to fetch URL content', ['url' => $url, 'error' => $e->getMessage()]);
            return "FAILED_CONTENT";
        }
    }

    private function refineContentForSearch(string $rawContent, bool $isFallback = false): ?array
    {
        $systemPrompt = $isFallback
            ? 'You are a content extraction expert. Analyze the provided URL-extracted text and extract a clear Arabic news title. 
               If the text is garbled, unreadable, or contains only symbols/code, respond with title: "INVALID".
               
               IMPORTANT: Always respond in valid JSON format with these exact keys:
               {
                 "title": "The news headline in Arabic (or INVALID if unreadable)",
                 "body": "Brief summary of the news content in Arabic (max 200 chars)",
                 "keywords": "Comma-separated Arabic keywords for search"
               }'
            : 'You are an expert Arabic news analyst and fact-checker. Your task is to extract the core claim from the provided news content.
               
               RULES:
               1. Extract the main news headline/claim in Arabic
               2. Identify key entities (people, organizations, locations, dates)
               3. Generate search keywords that would help verify this claim
               4. If content is unreadable/garbled, set title to "INVALID"
               
               IMPORTANT: Respond ONLY in valid JSON format:
               {
                 "title": "Main claim or headline in Arabic",
                 "body": "Brief factual summary in Arabic (max 200 chars)",
                 "keywords": "Arabic search keywords, comma-separated"
               }';

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.groq.api_key'),
                'Content-Type' => 'application/json',
            ])
            ->timeout(30)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => self::FAST_MODEL,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Content to analyze:\n\n" . $rawContent]
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.1,
            ]);

            if (!$response->successful()) {
                Log::error('Groq API error in refineContentForSearch', ['status' => $response->status()]);
                return null;
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? null;
            
            if (!$content) {
                return null;
            }

            return json_decode($content, true);
        } catch (\Exception $e) {
            Log::error('Exception in refineContentForSearch', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function searchInTrustedSources(array $data, ?int $days = null, int $limit = 7): array
    {
        if (!isset($data['title']) || mb_strlen($data['title']) < 10) {
            return [];
        }

        try {
            $domains = TrustedDomain::where('is_active', true)->pluck('domain')->toArray();
            if (empty($domains)) {
                Log::warning('No active trusted domains configured');
                return [];
            }

            // Combine title and keywords for better search
            $searchQuery = $data['title'];
            if (!empty($data['keywords'])) {
                $searchQuery .= ' ' . $data['keywords'];
            }

            $payload = [
                'api_key' => config('services.tavily.api_key'),
                'query' => mb_substr($searchQuery, 0, 400),
                'search_depth' => 'advanced',
                'include_domains' => $domains,
                'max_results' => $limit,
            ];

            if ($days) {
                $payload['days'] = $days;
            }

            $response = Http::timeout(25)->post('https://api.tavily.com/search', $payload);

            if ($response->successful()) {
                $results = $response->json()['results'] ?? [];
                return collect($results)
                    ->filter(function ($result) use ($domains) {
                        foreach ($domains as $domain) {
                            if (str_contains($result['url'] ?? '', $domain)) {
                                return true;
                            }
                        }
                        return false;
                    })
                    ->map(function ($result) {
                        // Extract date if not provided by API
                        if (empty($result['published_date'])) {
                            $result['published_date'] = $this->extractDate($result);
                        }
                        return $result;
                    })
                    ->values()
                    ->all();
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Search in trusted sources failed', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Try to extract date from content or URL.
     */
    private function extractDate(array $result): ?string
    {
        // 1. Try URL first (Y-m-d or Y/m/d)
        $url = $result['url'] ?? '';
        if (preg_match('/(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/', $url, $matches)) {
            return $matches[1] . '-' . str_pad($matches[2], 2, '0', STR_PAD_LEFT) . '-' . str_pad($matches[3], 2, '0', STR_PAD_LEFT);
        }

        // 2. Try content snippet (Arabic dates)
        // Matches: "06 يناير 2026", "6 كانون الثاني 2026", "2026-01-06"
        $content = $result['content'] ?? '';
        $months = implode('|', [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
            'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
            'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'
        ]);

        if (preg_match('/(\d{1,2})\s+('.$months.')\s+(\d{4})/', $content, $matches)) {
             return $matches[1] . ' ' . $matches[2] . ' ' . $matches[3];
        }
        
        return null; // No date found
    }

    /**
     * Generate final verdict by analyzing claim against found sources.
     */
    private function finalVerdict(array $originalNews, array $searchResults): array
    {
        if (empty($searchResults)) {
            return [
                'rating' => 'غير مؤكد',
                'percentage' => 0,
                'summary' => 'لم نعثر على مصادر موثوقة تؤكد أو تنفي هذا الخبر. يُنصح بالتحقق من مصادر إضافية.',
                'evidence' => ''
            ];
        }

        try {
            $snippets = collect($searchResults)
                ->take(5)
                ->map(fn($item) => [
                    'title' => $item['title'] ?? '',
                    'url' => $item['url'] ?? '',
                    'content' => mb_substr($item['content'] ?? '', 0, 800)
                ])
                ->toArray();

            $systemPrompt = <<<PROMPT
You are an expert forensic fact-checker specializing in Arabic news verification. Your task is to analyze whether the provided claim is supported, contradicted, or unverifiable based on the search results from trusted sources.

VERIFICATION RULES:
1. CONTEXTUAL RELEVANCE: First determine if the search results are actually related to the claim. Unrelated results = "غير مؤكد" with 0%.
2. EVIDENCE ANALYSIS: Look for direct confirmation, contradiction, or partial information.
3. SOURCE QUALITY: Weight official government/news agency sources higher.

CONFIDENCE SCORING (be conservative):
- 0-49%: "غير صحيح" (False) - Sources directly contradict the claim
- 50-69%: "غير مؤكد" (Unverified) - Insufficient evidence or mixed signals  
- 70-89%: "صحيح" (True) - Multiple sources confirm with minor variations
- 90-100%: "رسمي" (Official) - Official sources directly confirm

OUTPUT FORMAT (respond ONLY with this JSON structure):
{
  "rating": "One of: رسمي, صحيح, غير مؤكد, غير صحيح",
  "percentage": <number 0-100>,
  "summary": "Detailed Arabic explanation of the verdict (2-3 sentences)",
  "evidence": "Direct Arabic quote from sources that supports the verdict"
}

IMPORTANT: 
- All text fields MUST be in Arabic
- Be skeptical - when in doubt, use "غير مؤكد"
- The summary should explain WHY you reached this conclusion
PROMPT;

            $userMessage = "الادعاء المراد التحقق منه:\n" . ($originalNews['title'] ?? '') . "\n\n";
            $userMessage .= "نتائج البحث من المصادر الموثوقة:\n" . json_encode($snippets, JSON_UNESCAPED_UNICODE);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.groq.api_key'),
                'Content-Type' => 'application/json',
            ])
            ->timeout(60)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => self::PRIMARY_MODEL,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage]
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.1,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;
                
                if ($content) {
                    $result = json_decode($content, true);
                    
                    if ($result && isset($result['percentage'])) {
                        // Enforce correct label based on percentage thresholds
                        $percentage = max(0, min(100, (int)$result['percentage']));
                        $result['percentage'] = $percentage;
                        $result['rating'] = $this->getCorrectLabel($percentage);
                        
                        return $result;
                    }
                }
            }

            // Fallback response when API fails
            return $this->buildFallbackVerdict($searchResults);
            
        } catch (\Exception $e) {
            Log::error('Final verdict generation failed', ['error' => $e->getMessage()]);
            return $this->buildFallbackVerdict($searchResults);
        }
    }

    private function buildFallbackVerdict(array $searchResults): array
    {
        $summary = !empty($searchResults)
            ? "وجدنا مصادر متعلقة بالموضوع: " . mb_substr($searchResults[0]['title'] ?? '', 0, 100)
            : 'تعذر التحليل التلقائي. يُرجى المحاولة مرة أخرى.';

        return [
            'rating' => 'غير مؤكد',
            'percentage' => 50,
            'summary' => $summary,
            'evidence' => $searchResults[0]['title'] ?? ''
        ];
    }

    /**
     * Summarize the search results to provide a comprehensive overview.
     */
    private function summarizeResults(array $originalNews, array $searchResults): array
    {
        if (empty($searchResults)) {
            return [
                'summary' => 'لم نعثر على مصادر موثوقة حول هذا الموضوع. يُنصح بالبحث باستخدام كلمات مفتاحية مختلفة.',
            ];
        }

        try {
            $snippets = collect($searchResults)
                ->take(7)
                ->map(fn($item) => [
                    'title' => $item['title'] ?? '',
                    'url' => $item['url'] ?? '',
                    'content' => mb_substr($item['content'] ?? '', 0, 800)
                ])
                ->toArray();

            $systemPrompt = <<<PROMPT
You are an expert news analyst specializing in Arabic media. Your task is to provide a comprehensive, detailed research report on the topic based on the provided search results from trusted sources.

RULES:
1. Synthesize information from multiple sources into a rich, coherent narrative.
2. **Structure the report** with clear paragraphs.
3. **Detail is key**: cover key events, context, different perspectives, and timelines.
4. **Citations**: When stating a specific fact, try to mention the source name in brackets e.g. [Al Jazeera].
5. Do NOT judge true/false or give a verdict.
6. Use clear, professional, and engaging Arabic.

OUTPUT FORMAT (respond ONLY with this JSON structure):
{
  "summary": "A detailed, multi-paragraph Arabic report on the topic. It should be comprehensive enough that the user gets a full understanding without clicking links."
}

IMPORTANT: 
- The summary MUST be in Arabic.
- Aim for a high-quality journalistic style.
PROMPT;

            $userMessage = "الموضوع للبحث:\n" . ($originalNews['title'] ?? '') . "\n\n";
            $userMessage .= "المصادر:\n" . json_encode($snippets, JSON_UNESCAPED_UNICODE);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.groq.api_key'),
                'Content-Type' => 'application/json',
            ])
            ->timeout(60)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => self::PRIMARY_MODEL,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage]
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.3,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;
                
                if ($content) {
                    $result = json_decode($content, true);
                    return $result ?? ['summary' => 'فشل توليد الملخص'];
                }
            }

            return ['summary' => 'تعذر توليد الملخص التلقائي. يرجى مراجعة المصادر أدناه.'];
            
        } catch (\Exception $e) {
            Log::error('Summary generation failed', ['error' => $e->getMessage()]);
            return ['summary' => 'حدث خطأ أثناء تحليل النتائج.'];
        }
    }
    

    /**
     * Get the correct Arabic label based on confidence percentage.
     */
    private function getCorrectLabel(int $percentage): string
    {
        return match (true) {
            $percentage >= 90 => 'رسمي',
            $percentage >= 70 => 'صحيح',
            $percentage >= 50 => 'غير مؤكد',
            default => 'غير صحيح',
        };
    }

    /**
     * Main entry point for fact-checking a news claim or URL.
     * Checks cache first, then processes and stores new checks.
     */
    /**
     * Main entry point for fact-checking a news claim or URL.
     * Checks cache first, then processes and stores new checks.
     */
    public function check(string $input, ?int $days = null, ?int $userId = null): array
    {
        $inputHash = md5(trim(mb_strtolower($input)) . ($days ? "_$days" : ""));
        
        // Check cache first
        $existingCheck = \App\Models\FactCheck::where('hash', $inputHash)->first();
        if ($existingCheck) {
            // If user is authenticated, attach to pivot table
            if ($userId) {
                $existingCheck->users()->syncWithoutDetaching([$userId]);
            }

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

        // Process new input
        $processed = $this->identifyInputType($input);
        $raw = $processed['content'];
        $isFallback = ($raw === "FAILED_CONTENT");

        if ($isFallback && $processed['type'] === 'url') {
            $raw = "عنوان الخبر من الرابط: " . $this->extractTitleFromUrl($input);
        }

        $data = $this->refineContentForSearch($raw, $isFallback);
        
        if (!$data || ($data['title'] ?? '') === "INVALID" || empty($data['title'])) {
            return [
                'status' => 'error', 
                'message' => 'عذراً، لم نتمكن من استخراج خبر واضح من النص المدخل. يرجى التأكد من كتابة النص بشكل صحيح أو إدخال رابط مباشر للخبر.'
            ];
        }

        $results = $this->searchInTrustedSources($data, $days, self::VERIFY_SOURCE_LIMIT);
        $verdict = $this->finalVerdict($data, $results);

        $searchScore = !empty($results) 
            ? (collect($results)->avg('score') ?? 0) * 100 
            : 0;
        
        $verdictPercentage = (int)($verdict['percentage'] ?? 0);
        
        $finalConfidence = !empty($results)
            ? (int)round(($verdictPercentage * 0.7) + ($searchScore * 0.3))
            : $verdictPercentage;
        
        $finalConfidence = max(0, min(100, $finalConfidence));
        $finalLabel = $this->getCorrectLabel($finalConfidence);

        // Store the result
        $newRecord = \App\Models\FactCheck::create([
            'hash' => $inputHash,
            'input_text' => mb_substr($input, 0, 2000),
            'label' => $finalLabel,
            'confidence' => $finalConfidence,
            'summary' => $verdict['summary'] ?? 'فشل التحليل',
            'evidence' => $verdict['evidence'] ?? '',
            'period' => $days,
            'type' => 'verify',
            'sources' => collect($results)->take(self::VERIFY_SOURCE_LIMIT)->map(fn($r) => [
                'title' => $r['title'] ?? '',
                'url' => $r['url'] ?? '',
                'date' => $r['published_date'] ?? null
            ])->toArray()
        ]);

        if ($userId) {
            $newRecord->users()->attach($userId);
        }

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

    /**
     * Search mode: Summarize topic without true/false verdict
     */
    public function search(string $input, ?int $days = null, ?int $userId = null): array
    {
        $inputHash = md5(trim(mb_strtolower($input)) . ($days ? "_$days" : "") . "_search");
        
        // Check cache first
        $existingCheck = \App\Models\FactCheck::where('hash', $inputHash)->first();
        if ($existingCheck) {
            if ($userId) {
                $existingCheck->users()->syncWithoutDetaching([$userId]);
            }

            return [
                'status' => 'Fetched from Cache',
                'verdict' => [
                    'label' => 'Search', // Special label for search
                    'confidence' => 100,
                    'summary' => $existingCheck->summary,
                    'evidence' => '',
                ],
                'sources' => $existingCheck->sources
            ];
        }

        // Process new input
        $processed = $this->identifyInputType($input);
        $raw = $processed['content'];
        $isFallback = ($raw === "FAILED_CONTENT");

        if ($isFallback && $processed['type'] === 'url') {
            $raw = "عنوان الخبر من الرابط: " . $this->extractTitleFromUrl($input);
        }

        $data = $this->refineContentForSearch($raw, $isFallback);
        
        if (!$data || ($data['title'] ?? '') === "INVALID" || empty($data['title'])) {
            return [
                'status' => 'error', 
                'message' => 'عذراً، لم نتمكن من استخراج موضوع واضح من النص المدخل.'
            ];
        }

        // Search with higher limit for research
        $results = $this->searchInTrustedSources($data, $days, self::SEARCH_SOURCE_LIMIT);
        
        // Generate summary instead of verdict
        $summaryResult = $this->summarizeResults($data, $results);

        // Store the result
        $newRecord = \App\Models\FactCheck::create([
            'hash' => $inputHash,
            'input_text' => mb_substr($input, 0, 2000),
            'label' => 'Search', // Special label for search
            'confidence' => 100, // Not applicable
            'summary' => $summaryResult['summary'] ?? 'فشل التلخيص',
            'evidence' => '', // No evidence needed for search
            'period' => $days,
            'type' => 'search',
            'sources' => collect($results)->take(self::SEARCH_SOURCE_LIMIT)->map(fn($r) => [
                'title' => $r['title'] ?? '',
                'url' => $r['url'] ?? '',
                'date' => $r['published_date'] ?? null
            ])->toArray()
        ]);

        if ($userId) {
            $newRecord->users()->attach($userId);
        }

        return [
            'status' => 'Search Completed',
            'verdict' => [
                'label' => 'Search',
                'confidence' => 100,
                'summary' => $newRecord->summary,
                'evidence' => '',
            ],
            'sources' => $newRecord->sources
        ];
    }

    /**
     * Identify if input is a URL or plain text.
     */
    private function identifyInputType(string $input): array
    {
        if (filter_var($input, FILTER_VALIDATE_URL)) {
            return ['type' => 'url', 'content' => $this->fetchUrlContent($input)];
        }
        return ['type' => 'text', 'content' => mb_substr($input, 0, 3000)];
    }

    /**
     * Extract a readable title from a URL path as fallback.
     * Tries to find the most meaningful segment in the path.
     */
    private function extractTitleFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?? '';
        
        // Decode path to handle Arabic characters
        $decodedPath = urldecode($path);
        
        // Split path into segments using slash or common separators
        $segments = preg_split('#[\\/]#', $decodedPath, -1, PREG_SPLIT_NO_EMPTY);
        
        if (empty($segments)) {
            return "INVALID";
        }

        // Filter and clean segments
        $candidates = collect($segments)
            ->map(function ($segment) {
                // Remove file extensions
                $clean = preg_replace('/\.(html|htm|php|aspx)$/i', '', $segment);
                // Replace separators with spaces
                return str_replace(['-', '_', '+'], ' ', $clean);
            })
            ->filter(function ($segment) {
                // Filter out purely numeric segments, short segments, or dates
                if (is_numeric($segment)) return false;
                if (mb_strlen($segment) < 4) return false;
                // Filter common year/month patterns if they appear alone? (Keep simple for now)
                return true;
            })
            ->values();

        if ($candidates->isEmpty()) {
            return "INVALID";
        }

        // Return the longest candidate (usually the title slug)
        // or the last candidate if we assume structure is /category/title
        $bestCandidate = $candidates->sortByDesc(fn($s) => mb_strlen($s))->first();

        return  trim(preg_replace('/\s+/', ' ', $bestCandidate));
    }
}
