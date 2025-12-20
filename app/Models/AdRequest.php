<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdRequest extends Model
{
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
