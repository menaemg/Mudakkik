<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
  /** @use HasFactory<\Database\Factories\LikeFactory> */
  use HasFactory;
  protected $fillable = [
    'name',
    'slug',
    'description'
  ];
  public function posts()
  {
    return $this->hasMany(Post::class);
  }
  public function scopeFilter($query, $request)
  {
    if ($request->filled('search')) {
      $search = $request->get('search');

      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%{$search}%")
          ->orWhere('slug', 'like', "%{$search}%");
      });
    }

    return $query;
  }
}
