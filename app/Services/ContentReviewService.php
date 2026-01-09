<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ContentReviewService
{
    public function audit($text)
    {
        $prompt = "As a strict Arabic language professor, evaluate this text. 
    Follow these SCORING RULES strictly:
    1. Start with 100 points.
    2. Deduct 5 points for EACH grammatical error (نحو).
    3. Deduct 5 points for EACH spelling error (إملاء).
    4. Deduct 5 points if the text contains any Egyptian slang or colloquial words (عامية).
    5. Deduct 50 points if there is profanity.

    Expected Verdicts:
    - Score 80-100: Published (Professional Arabic only).
    - Score 50-79: Pending (Understandable but has mistakes).
    - Score < 50: Rejected (Too many errors or slang).

    Return ONLY JSON:
    {
      \"score\": (calculated number),
      \"notes\": \"Detailed Arabic list of errors found and why they are wrong.\",
      \"verdict\": \"(published/pending/rejected)\"
    }

    Text to audit:
    " . $text;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a very strict linguistic auditor. No prose, only JSON.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.1,
            'response_format' => ['type' => 'json_object']
        ]);

        $content = json_decode($response->json()['choices'][0]['message']['content'], true);

        return [
            'score' => $content['score'] ?? 0,
            'notes' => $content['notes'] ?? 'لا توجد ملاحظات.',
            'verdict' => $content['verdict'] ?? 'rejected'
        ];
    }
}
