<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Policy;
use Illuminate\Support\Str;

class AiAuditService
{
    private const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
    public const MAIN_POLICY_TYPE = 'سياسة النشر ومحتوى الموقع';

    public function audit($postBody)
    {
        $apiKey = config('services.groq.api_key');
        if (!$apiKey) {
            Log::warning('Groq API key is missing (services.groq.api_key).');
            return null;
        }

        $policy = Policy::where('type', self::MAIN_POLICY_TYPE)->first();
        $policyContent = ($policy && !empty($policy->content)) ? $policy->content : $this->getDefaultPolicy();

        $systemPrompt = $this->buildSystemPrompt($policyContent);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])
                ->retry(2, 500)
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
                $content = data_get($response->json(), 'choices.0.message.content');
                if (!is_string($content)) return null;

                $decoded = json_decode($content, true);
                if (!is_array($decoded)) {
                    Log::warning('Groq returned non-JSON content for audit.', [
                        'content_preview' => Str::limit($content, 300),
                    ]);
                    return null;
                }
                return $decoded;
            }

            Log::error('Groq API Error in Audit', [
                'status' => $response->status(),
                'body_preview' => Str::limit($response->body(), 500),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Exception in AiAuditService', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function buildSystemPrompt($policyContent)
    {
        return "You are a professional Arabic news editor. Your task is to audit the provided article based on the site policy.\nPOLICY: \"{$policyContent}\"\n\nRULES:\n1. SCORE: Give a quality score from 0-100.\n2. VERDICT: 'published', 'pending', or 'rejected'.\n3. VERDICT_TYPE: 'trusted', 'misleading', or 'fake'.\n4. NOTES: Detailed feedback in Arabic for the author.\n\nRESPONSE FORMAT (JSON ONLY):\n{\n  \"score\": 85,\n  \"verdict\": \"published\",\n  \"verdict_type\": \"trusted\",\n  \"notes\": \"...\"\n}";
    }

    private function getDefaultPolicy()
    {
        return <<<POLICY
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
}