<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Drops the unused ad_requests table - all ad functionality uses the advertisments table.
     */
    public function up(): void
    {
        Schema::dropIfExists('ad_requests');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('ad_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('title');
            $table->string('image_path');
            $table->string('target_url');
            $table->date('requested_start_date');
            $table->date('requested_end_date');
            $table->text('admin_notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'waiting_payment'])->default('pending');
            $table->timestamps();
        });
    }
};
