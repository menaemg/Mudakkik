<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('ai_recurring_credits')->default(0)->after('credibility_score');

            $table->integer('ai_bonus_credits')->default(0)->after('ai_recurring_credits');

            $table->integer('ad_credits')->default(0)->after('ai_bonus_credits');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'ai_recurring_credits',
                'ai_bonus_credits',
                'ad_credits'
            ]);
        });
    }
};
