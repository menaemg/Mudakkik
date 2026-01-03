<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\User;

class UpgradeRequest extends Model
{
    /** @use HasFactory<\Database\Factories\UpgreadRequestFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'documents',
        'admin_notes',
        'status',
        'request_message',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function scopeFilter(Builder $query, Request $request): Builder
{
    return $query
        ->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->search;

            $q->whereHas('user', function ($uq) use ($search) {
                $uq->where('name', 'like', "%{$search}%")
                   ->orWhere('email', 'like', "%{$search}%");
            });
        })
        ->when($request->filled('status'), function ($q) use ($request) {
            $q->where('status', $request->status);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
