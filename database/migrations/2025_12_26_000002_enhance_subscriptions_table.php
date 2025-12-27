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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->enum('status', ['active', 'cancelled', 'expired', 'past_due'])->default('active')->after('ends_at');
            $table->string('provider')->nullable()->after('status');
            $table->string('provider_subscription_id')->nullable()->after('provider');
            $table->boolean('auto_renew')->default(true)->after('provider_subscription_id');
            $table->timestamp('cancelled_at')->nullable()->after('auto_renew');
            $table->timestamp('trial_ends_at')->nullable()->after('cancelled_at');
            
            // Add proper foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['plan_id']);
            $table->dropColumn([
                'status',
                'provider',
                'provider_subscription_id',
                'auto_renew',
                'cancelled_at',
                'trial_ends_at',
            ]);
        });
    }
};
