<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpgreadRequest extends Model
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}