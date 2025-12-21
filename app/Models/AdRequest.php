<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'status'
    ];

    protected $casts = [
        'requested_start_date' => 'date',
        'requested_end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
