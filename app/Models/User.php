<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Bootstrap the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            $freePlan = Plan::where('is_free', true)->first();

            if (!$freePlan) {
                Log::warning('Free plan not found for user.', ['user_id' => $user->id]);
                return;
            }

            $features = $freePlan->features ?? [];
            $initialAiCredits = $features['monthly_ai_credits'] ?? 0;
            $initialAdCredits = $features['monthly_ad_credits'] ?? 0;

            $user->update([
                'ai_recurring_credits' => $initialAiCredits,
                'ad_credits' => $initialAdCredits
            ]);

            $user->subscriptions()->create([
                'plan_id' => $freePlan->id,
                'status' => 'active',
                'start_at' => now(),
                'ends_at' => null,
            ]);
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
        'avatar',
        'ai_recurring_credits',
        'ai_bonus_credits',
        'ad_credits',
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
            'is_active' => 'boolean',
            'is_verified_journalist' => 'boolean',
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
        return $this->belongsToMany(Post::class, 'likes')->withTimestamps();
    }

    public function likedPosts()
    {
        return $this->likes();
    }

    public function adRequests()
    {
        return $this->hasMany(AdRequest::class);
    }

    public function upgradeRequests()
    {
        return $this->hasMany(UpgradeRequest::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function reports()
    {
        return $this->hasMany(PostReport::class);
    }

    public function scopeFilter($query, $filter)
    {
        if ($filter->filled('search')) {
            $search = $filter->get('search');
            $search = str_replace(['%', '_'], ['\%', '\_'], $search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Get the user's current active subscription.
     */
    public function currentSubscription(): ?Subscription
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>', now());
            })
            ->with('plan')
            ->orderByDesc('created_at')
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

        if (!array_key_exists($feature, $features)) {
            return false;
        }

        $value = $features[$feature];

        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value > 0;
        }

        // null means unlimited access
        if ($value === null) {
            return true;
        }

        return (bool) $value;
    }

    /**
     * Get a numeric feature limit from the user's plan.
     */
    public function getFeatureLimit(string $feature): ?int
    {
        $plan = $this->currentPlan();
        if (!$plan) {
            return null;
        }

        $features = $plan->features ?? [];

        if (!array_key_exists($feature, $features)) {
            return null;
        }

        $value = $features[$feature];

        if ($value === null) {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }


    public function consumeAiCredit(int $amount = 1): bool
    {
        return \DB::transaction(function () use ($amount) {
            $user = static::lockForUpdate()->find($this->id);
            
            if (!$user) {
                return false;
            }

            // Check recurring credits first
            if ($user->ai_recurring_credits >= $amount) {
                $user->decrement('ai_recurring_credits', $amount);
                // Refresh the current instance to reflect the change
                $this->refresh();
                return true;
            }

            // Check combined credits
            $totalAvailable = $user->ai_recurring_credits + $user->ai_bonus_credits;

            if ($totalAvailable >= $amount) {
                $neededFromBonus = $amount - $user->ai_recurring_credits;

                $user->update(['ai_recurring_credits' => 0]);
                $user->decrement('ai_bonus_credits', $neededFromBonus);
                
                // Refresh the current instance to reflect the changes
                $this->refresh();
                return true;
            }

            return false;
        });
    }

    public function consumeAdCredit(int $days): bool
    {
        return \DB::transaction(function () use ($days) {
            $user = static::lockForUpdate()->find($this->id);
            
            if (!$user) {
                return false;
            }

            if ($user->ad_credits >= $days) {
                $user->decrement('ad_credits', $days);
                // Refresh the current instance to reflect the change
                $this->refresh();
                return true;
            }
            
            return false;
        });
    }

    public function factChecks()
    {
        return $this->belongsToMany(FactCheck::class, 'fact_check_user')->withTimestamps();
    }
}
