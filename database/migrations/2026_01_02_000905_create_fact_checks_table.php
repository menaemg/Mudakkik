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
        Schema::create('fact_checks', function (Blueprint $table) {
            $table->id();
            $table->string('hash')->unique(); 
            $table->text('input_text');      
            $table->string('label');       
            $table->integer('confidence');   
            $table->text('summary');        
            $table->text('evidence')->nullable(); 
            $table->json('sources');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fact_checks');
    }
};
