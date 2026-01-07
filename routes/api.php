<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\FactCheckController;
use Illuminate\Support\Facades\Route;




Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/verify-news', [FactCheckController::class, 'verifyApi']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
