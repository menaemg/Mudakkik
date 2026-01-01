<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fact_checks', function (Blueprint $table) {
            $table->id();
            $table->text('user_input');
            $table->string(column: 'verdict')->default('pending');
            $table->decimal('confidence_score')->default(0);
            $table->text('ai_explantion')->nullable();
            $table->json('evidence_source')->nullable();
         
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fact_checks');
    }
};
