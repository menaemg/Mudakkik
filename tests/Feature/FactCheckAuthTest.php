<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('denies verification when user has insufficient credits', function () {
    $this->seed(\Database\Seeders\PlanSeeder::class);
    $user = User::factory()->create();
    
    // Explicitly set credits to 0 after creation (as boot logic sets them to free plan default)
    $user->update([
        'ai_recurring_credits' => 0,
        'ai_bonus_credits' => 0,
    ]);

    $response = $this->actingAs($user)->post('/verify-news', [
        'text' => 'This is a test news item that needs verification and is long enough to pass validation checks.',
    ]);

    $response->assertSessionHas('error');
    $response->assertSessionHas('open_plan_modal', true);
});

it('requires authentication for fact verification', function () {
    $response = $this->post('/verify-news', [
        'text' => 'This is a test news item that needs verification and is long enough to pass validation checks.',
    ]);

    $response->assertSessionHas('error', 'يجب تسجيل الدخول لاستخدام هذه الميزة.');
});
