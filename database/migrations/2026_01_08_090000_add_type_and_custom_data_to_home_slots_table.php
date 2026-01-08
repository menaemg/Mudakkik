<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds 'type' and 'custom_data' columns to home_slots table
     * to support different slot types (post vs ad) and custom configuration.
     */
    public function up(): void
    {
        Schema::table('home_slots', function (Blueprint $table) {
            $table->string('type')->nullable()->after('post_id');
            $table->text('custom_data')->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_slots', function (Blueprint $table) {
            $table->dropColumn(['type', 'custom_data']);
        });
    }
};
