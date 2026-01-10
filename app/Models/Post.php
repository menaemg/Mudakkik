<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'content_hash',
        'image',
        'status',
        'type',
        'ai_verdict',
        'user_id',
        'category_id',
        'is_featured',
        'is_cover_story',
        'is_breaking',
        'is_editors_choice',
        'views',
        'ai_score',
        'ai_report'
    ];

    protected $appends = ['likes_count'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->content_hash = md5($post->body);
        });

        static::updating(function ($post) {
            if ($post->isDirty('body')) {
                $post->content_hash = md5($post->body);
            }
        });
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) {
                    return asset('assets/images/post.webp');
                }
                if (str_starts_with($value, 'http')) {
                    return $value;
                }
                return asset('storage/' . $value);
            }
        );
    }

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
        if (array_key_exists('likes_count', $this->attributes)) {
            return $this->attributes['likes_count'];
        }
        return $this->likes()->count();
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

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePublishedTrusted($query)
    {
        return $query->where('status', 'published')
            ->whereIn('ai_verdict', ['trusted', 'checking']);
    }
}