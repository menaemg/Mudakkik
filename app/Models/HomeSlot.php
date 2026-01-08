<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'section',
        'slot_name',
        'post_id',
        'type',
        'custom_data',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function scopeSection($query, $sectionName)
    {
        return $query->where('section', $sectionName);
    }
}
