<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Bootstrap the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-assign free plan when user is created
        static::created(function ($user) {
            $freePlan = Plan::where('is_free', true)->first();
            if ($freePlan) {
                $user->subscriptions()->create([
                    'plan_id' => $freePlan->id,
                    'status' => 'active',
                    'start_at' => now(),
                    'ends_at' => null,
                ]);
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'username',
        'credibility_score',
        'is_verified_journalist',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
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
        ];
    }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function followers()
    {
        return $this->hasMany(Follow::class, 'followed_user_id');
    }
    public function following()
    {
        return $this->hasMany(Follow::class, 'following_user_id');
    }
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function scopeFilter($query, $filter)
    {
        if ($filter->filled('search')) {
            $search = $filter->get('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Get all subscriptions for the user.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the user's current active subscription.
     */
    public function currentSubscription(): ?Subscription
    {
        return $this->subscriptions()
            ->active()
            ->with('plan')
            ->first();
    }

    /**
     * Check if user has an active subscription.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->currentSubscription() !== null;
    }

    /**
     * Get the user's current plan.
     */
    public function currentPlan(): ?Plan
    {
        return $this->currentSubscription()?->plan;
    }

    /**
     * Check if user is on a free plan.
     */
    public function isOnFreePlan(): bool
    {
        $plan = $this->currentPlan();
        return $plan && $plan->is_free;
    }

    /**
     * Check if user can access a feature based on their plan.
     */
    public function canAccess(string $feature): bool
    {
        $plan = $this->currentPlan();
        if (!$plan) {
            return false;
        }

        $features = $plan->features ?? [];
        return $features[$feature] ?? false;
    }
}
