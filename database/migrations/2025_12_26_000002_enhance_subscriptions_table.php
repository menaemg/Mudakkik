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
            $table->string('status')->default('active')->after('ends_at');
            $table->string('provider')->nullable()->after('status');
            $table->string('provider_subscription_id')->nullable()->after('provider');
            $table->boolean('auto_renew')->default(true)->after('provider_subscription_id');
            $table->timestamp('cancelled_at')->nullable()->after('auto_renew');
            $table->timestamp('trial_ends_at')->nullable()->after('cancelled_at');
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
