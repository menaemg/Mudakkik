<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tag;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'body',
        'image',
        'status',
        'type',
        'ai_verdict',
        'user_id',
        'category_id',
        'is_featured',
        'is_breaking',
        'views',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }


    public function scopeFilter($query, $filters)
    {
        if ($filters->filled('search')) {
            $search = $filters->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }
        if ($filters->filled('status')) {
            $query->where('status', $filters->get('status'));
        }
        if ($filters->filled('verdict')) {
            $query->where('ai_verdict', $filters->get('verdict'));
        }
        if ($filters->filled('category')) {
            $query->where('category_id', $filters->get('category'));
        }
        return $query;
    }
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if ($value && Storage::disk('public')->exists($value)) {
                    return asset('storage/' . $value);
                }
                return asset('assets/images/post.webp');
            }
        );
    }

 public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function reports()
    {
        return $this->hasMany(PostReport::class);
    }

    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    public function getLikesCountAttribute()
    {
        // Use pre-loaded count if available (from withCount)
        if (array_key_exists('likes_count', $this->attributes)) {
            return $this->attributes['likes_count'];
        }

        return $this->likes()->count();
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        $rawImage = $this->getOriginal('image');

        if (!$rawImage) {
            return 'https://via.placeholder.com/800x600';
        }

        return str_starts_with($rawImage, 'http') ? $rawImage : asset('storage/' . $rawImage);
    }

    public function scopePublishedTrusted($query)
    {
        return $query->where('status', 'published')
                    ->where(function($q) {
                        $q->where('ai_verdict', '!=', 'fake')
                          ->orWhereNull('ai_verdict');
                    });
    }
}
