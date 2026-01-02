<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AdRequest extends Model
{
    /** @use HasFactory<\Database\Factories\AdRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'image_path',
        'target_url',
        'requested_start_date',
        'requested_end_date',
        'admin_notes',
        'status',
    ];

    protected $casts = [
        'requested_start_date' => 'date',
        'requested_end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeFilter(Builder $query, Request $request): Builder
    {
        return $query
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;

                $q->where(function ($subQuery) use ($search) {
                    $subQuery->whereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhere('title', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), function ($q) use ($request) {
                $q->where('status', $request->status);
            });
    }
}
