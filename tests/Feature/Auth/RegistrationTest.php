<?php
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $email = 'test' . uniqid() . '@example.com';

    $response = $this->post('/register', [
        'name' => 'Test User',
        'username' => 'testuser' . uniqid(),
        'email' => $email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasNoErrors();
    
    $this->assertDatabaseHas('users', [
        'email' => $email,
    ]);

    $this->assertCredentials([
        'email' => $email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));
});