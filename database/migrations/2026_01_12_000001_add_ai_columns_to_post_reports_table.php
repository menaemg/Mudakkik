<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_reports', function (Blueprint $table) {
            $table->unsignedTinyInteger('ai_score')->nullable()->after('status');
            $table->text('ai_summary')->nullable()->after('ai_score');
            $table->enum('ai_verdict', ['valid', 'invalid', 'needs_review'])
                ->nullable()
                ->after('ai_summary');
            $table->foreignId('reviewed_by')
                ->nullable()
                ->after('ai_verdict')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('post_reports', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['ai_score', 'ai_summary', 'ai_verdict', 'reviewed_by']);
        });
    }
};
