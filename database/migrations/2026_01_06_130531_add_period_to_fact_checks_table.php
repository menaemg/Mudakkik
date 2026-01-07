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
        Schema::table('fact_checks', function (Blueprint $table) {
            $table->integer('period')->nullable()->after('input_text')->comment('Search period in days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fact_checks', function (Blueprint $table) {
            $table->dropColumn('period');
        });
    }
};
