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
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'ai_score')) {
                $table->integer('ai_score')->default(0)->after('ai_verdict');
            }
            if (!Schema::hasColumn('posts', 'ai_report')) {
                $table->text('ai_report')->nullable()->after('ai_score');
            }
            if (!Schema::hasColumn('posts', 'content_hash')) {
                $table->string('content_hash')->nullable()->after('body');
            }
        });
        \App\Models\Post::chunk(100, function ($posts) {
            foreach ($posts as $post) {
                $post->update(['content_hash' => md5($post->body)]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['ai_score', 'ai_report', 'content_hash']);
        });
    }
};
