<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Policy;

class AiAuditService
{
    private const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
    private const FAST_MODEL = 'llama-3.1-8b-instant';

    public function audit($postBody)
    {
        $policy = Policy::where('type', 'سياسة النشر ومحتوى الموقع')->first();

if ($policy && !empty($policy->content)) {
            $policyContent = $policy->content;
        } else {
            $policyContent = <<<POLICY
أهلاً بك في منصتنا. لضمان جودة المحتوى وسلامة البيئة التفاعلية، تخضع جميع المقالات لعملية تدقيق آلي فورية بناءً على المعايير التالية:

1. معايير قبول ونشر المقال (Published)
- اللغة: لغة عربية واضحة.
- السلامة: خلو تمام من التحريض أو الكراهية.
- الإملاء: صحة الحروف بنسبة 80% فأكثر.

2. حالات المراجعة والتعديل (Pending)
- الأخطاء الإملائية، العامية المفرطة، أو الحاجة لتحسين التنسيق.

3. حالات الرفض التام (Rejected)
- الألفاظ الخارجة، التحريض، الكراهية، أو المحتوى العشوائي (Spam).
POLICY;
        }
        $systemPrompt = <<<PROMPT
You are a professional Arabic news editor. Your task is to audit the provided article based on the site policy.
POLICY: "{$policyContent}"

RULES:
1. SCORE: Give a quality score from 0-100.
2. VERDICT: 
   - 'published': excellent, follows policy.
   - 'pending': has minor issues (slang, typos).
   - 'rejected': violates core policies (hate, fake news).
3. VERDICT_TYPE: 'trusted', 'misleading', or 'fake'.
4. NOTES: Detailed feedback in Arabic for the author.

RESPONSE FORMAT (JSON ONLY):
{
  "score": 85,
  "verdict": "published",
  "verdict_type": "trusted",
  "notes": "التقرير مكتوب بشكل جيد ولكن يحتاج لتنسيق الفقرات."
}
PROMPT;

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.groq.api_key'),
                'Content-Type' => 'application/json',
            ])
                ->timeout(45)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => self::PRIMARY_MODEL,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => "Article Content:\n" . $postBody]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.2,
                ]);

            if ($response->successful()) {
                return $response->json()['choices'][0]['message']['content'] ?? null;
            }

            Log::error('Groq API Error in Audit', ['body' => $response->body()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Exception in AiAuditService', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
