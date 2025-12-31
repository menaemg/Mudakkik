<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'slug',
    'price',
    'billing_interval',
    'duration_days',
    'provider_price_id',
    'is_free',
    'is_active',
    'sort_order',
    'features',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'is_free' => 'boolean',
    'is_active' => 'boolean',
    'features' => 'array',
  ];

  /**
   * Get subscriptions for this plan.
   */
  public function subscriptions(): HasMany
  {
    return $this->hasMany(Subscription::class);
  }

  /**
   * Scope to get only active plans.
   */
  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }

  /**
   * Scope to get only paid plans (non-free).
   */
  public function scopePaid($query)
  {
    return $query->where('is_free', false);
  }

  /**
   * Scope to order by sort_order.
   */
  public function scopeOrdered($query)
  {
    return $query->orderBy('sort_order');
  }

  /**
   * Check if this plan is recurring (monthly/yearly).
   */
  public function isRecurring(): bool
  {
    return in_array($this->billing_interval, ['monthly', 'yearly']);
  }

  /**
   * Check if this is a free plan.
   */
  public function isFree(): bool
  {
    return $this->is_free;
  }

  /**
   * Check if this plan is active.
   */
  public function isActive(): bool
  {
    return $this->is_active;
  }

  /**
   * Get the route key for the model.
   */
  public function getRouteKeyName(): string
  {
    return 'slug';
  }
}