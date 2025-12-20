<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'body', 'status', 'ai_verdict', 'user_id', 'category_id'];

   
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
