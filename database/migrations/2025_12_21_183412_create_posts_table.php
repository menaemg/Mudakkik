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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->string('image')->nullable();
            $table->unsignedBigInteger('views')->default(0);
            $table->enum('type', ['news', 'article'])->default('article');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_cover_story')->default(false);
            $table->boolean('is_breaking')->default(false);
            $table->boolean('is_editors_choice')->default(false);
            $table->enum('status', ['pending', 'published', 'rejected'])->default('pending');
            $table->enum('ai_verdict', ['trusted', 'fake', 'misleading', "checking"])->default('checking');;
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->timestamps();
        });
    }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('posts');
  }
};
