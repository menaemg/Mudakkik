<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    /** @use HasFactory<\Database\Factories\FollowFactory> */
    use HasFactory;
    protected $fillable = ['following_user_id', 'followed_user_id'];

    public function follower() {
        return $this->belongsTo(User::class, 'following_user_id');
    }

    public function following() {
        return $this->belongsTo(User::class, 'followed_user_id');
    }
}
