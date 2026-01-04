<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'reason',
        'status',
    ];

    // report تابع لبوست واحد
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // report تابع ليوزر واحد
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
