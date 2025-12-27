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
        Schema::table('plans', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name');
            $table->enum('billing_interval', ['monthly', 'yearly', 'one_time'])->default('monthly')->after('price');
            $table->integer('duration_days')->nullable()->after('billing_interval');
            $table->string('provider_price_id')->nullable()->after('duration_days');
            $table->boolean('is_free')->default(false)->after('provider_price_id');
            $table->boolean('is_active')->default(true)->after('is_free');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'billing_interval',
                'duration_days',
                'provider_price_id',
                'is_free',
                'is_active',
                'sort_order',
            ]);
        });
    }
};
