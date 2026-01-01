<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tag;

class Post extends Model
{
  /** @use HasFactory<\Database\Factories\PostFactory> */
  use HasFactory;
  protected $fillable = [
    'title',
    'body',
    'image',
    'status',
    'ai_verdict',
    'user_id',
    'category_id'
  ];

  public function tags()
  {
    return $this->belongsToMany(Tag::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }


  public function category()
  {
    return $this->belongsTo(Category::class);
  }

  public function likes()
  {
    return $this->hasMany(Like::class);
  }

  public function isLikedBy($userId)
  {
    return $this->likes()->where('user_id', $userId)->exists();
  }

  public function getLikesCountAttribute()
  {
    return $this->likes()->count();
  }

  public function scopePublished($query)
  {
    return $query->where('status', 'published');
  }
}
