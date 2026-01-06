<?php

use App\Models\UpgradeRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('prevents duplicate pending upgrade requests', function () {
    $this->seed(\Database\Seeders\PlanSeeder::class);
    $user = User::factory()->create();

    // First request should succeed
    $response = $this->actingAs($user)->post(route('upgrade-requests.store'), [
        'request_message' => 'This is my first upgrade request message that is long enough.',
    ]);
    $response->assertSessionHas('success');

    // Second request should fail
    $response = $this->actingAs($user)->post(route('upgrade-requests.store'), [
        'request_message' => 'This is my second upgrade request message that is long enough.',
    ]);
    $response->assertSessionHas('error', 'لديك طلب قيد المراجعة بالفعل.');
});

it('allows new request after previous is accepted', function () {
    $this->seed(\Database\Seeders\PlanSeeder::class);
    $user = User::factory()->create();

    // First request (manually created with accepted status)
    UpgradeRequest::create([
        'user_id' => $user->id,
        'request_message' => 'First request message that is long enough.',
        'status' => 'accepted',
        'documents' => null, // Column is now nullable
    ]);

    // New pending request should succeed
    $response = $this->actingAs($user)->post(route('upgrade-requests.store'), [
        'request_message' => 'This is a new upgrade request after my first was accepted.',
    ]);
    $response->assertSessionHas('success');
});
