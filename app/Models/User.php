<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Subscription;
use App\Models\Advertisements;
use App\Models\Posts;
use App\Models\upgrade_requests;
use App\Models\Subscriptions;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'role',
        'credibility_score',
        'is_verified_journalist',
        'bio'
    ];
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function upgradeRequests()
    {
        return $this->hasMany(upgrade_request::class);
    }
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
    public function advertisements()
    {
        return $this->hasMany(Advertisement::class);
    }
    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'likes');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_user_id', 'following_user_id');
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
