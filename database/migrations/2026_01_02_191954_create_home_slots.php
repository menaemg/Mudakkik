<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('home_slots', function (Blueprint $table) {
            $table->id();

            $table->string('section')->index();

            $table->string('slot_name');

            $table->foreignId('post_id')->nullable()->constrained('posts')->nullOnDelete();

            $table->timestamps();

            $table->unique(['section', 'slot_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_slots');
    }
};
