<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds position column (nullable with default) so ads can be created
     * without specifying a position. All ads will rotate randomly.
     */
    public function up(): void
    {
        Schema::table('advertisments', function (Blueprint $table) {
            if (!Schema::hasColumn('advertisments', 'position')) {
                $table->string('position')->nullable()->default('general')->after('target_link');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advertisments', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
};
