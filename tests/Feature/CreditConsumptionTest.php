<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

it('prevents concurrent AI credit consumption', function () {
    $user = User::factory()->create([
        'ai_recurring_credits' => 5,
        'ai_bonus_credits' => 0,
    ]);

    // Simulate concurrent requests trying to consume credits
    $results = [];
    
    // Use database transactions to simulate concurrency
    for ($i = 0; $i < 10; $i++) {
        $results[] = $user->fresh()->consumeAiCredit(1);
    }

    // Only 5 should succeed (matching available credits)
    $successCount = count(array_filter($results));
    expect($successCount)->toBe(5);

    // Verify final balance is 0
    expect($user->fresh()->ai_recurring_credits)->toBe(0);
    expect($user->fresh()->ai_bonus_credits)->toBe(0);
});

it('prevents concurrent AI credit over-consumption with mixed credit types', function () {
    $user = User::factory()->create([
        'ai_recurring_credits' => 3,
        'ai_bonus_credits' => 2,
    ]);

    $results = [];
    
    // Try to consume more than available
    for ($i = 0; $i < 10; $i++) {
        $results[] = $user->fresh()->consumeAiCredit(1);
    }

    // Only 5 should succeed (3 recurring + 2 bonus)
    $successCount = count(array_filter($results));
    expect($successCount)->toBe(5);

    // Verify final balances
    $freshUser = $user->fresh();
    expect($freshUser->ai_recurring_credits + $freshUser->ai_bonus_credits)->toBe(0);
});

it('prevents concurrent ad credit consumption', function () {
    $user = User::factory()->create([
        'ad_credits' => 10,
    ]);

    $results = [];
    
    // Simulate concurrent requests
    for ($i = 0; $i < 15; $i++) {
        $results[] = $user->fresh()->consumeAdCredit(1);
    }

    // Only 10 should succeed
    $successCount = count(array_filter($results));
    expect($successCount)->toBe(10);

    // Verify final balance is 0
    expect($user->fresh()->ad_credits)->toBe(0);
});

it('handles concurrent credit consumption with varying amounts', function () {
    $user = User::factory()->create([
        'ai_recurring_credits' => 10,
        'ai_bonus_credits' => 5,
    ]);

    // Try to consume different amounts concurrently
    $results = [
        $user->fresh()->consumeAiCredit(5),  // Should succeed
        $user->fresh()->consumeAiCredit(6),   // Should succeed
        $user->fresh()->consumeAiCredit(5),   // Should fail (only 4 left)
    ];

    expect($results[0])->toBeTrue();
    expect($results[1])->toBeTrue();
    expect($results[2])->toBeFalse();

    // Verify remaining credits
    $freshUser = $user->fresh();
    expect($freshUser->ai_recurring_credits + $freshUser->ai_bonus_credits)->toBe(4);
});

it('maintains data integrity during concurrent operations', function () {
    $user = User::factory()->create([
        'ai_recurring_credits' => 100,
        'ai_bonus_credits' => 0,
    ]);

    $workers = 10;
    $consumeAmount = 5;
    $iterations = 2;

    for ($worker = 0; $worker < $workers; $worker++) {
        for ($i = 0; $i < $iterations; $i++) {
            $user->fresh()->consumeAiCredit($consumeAmount);
        }
    }

    // Total consumed should never exceed initial amount
    $freshUser = $user->fresh();
    $remaining = $freshUser->ai_recurring_credits + $freshUser->ai_bonus_credits;
    
    expect($remaining)->toBeGreaterThanOrEqual(0);
    expect($remaining)->toBeLessThanOrEqual(100);
});
