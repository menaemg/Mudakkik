<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactCheck extends Model
{

    protected $fillable = [
        'hash',
        'input_text',
        'label',
        'confidence',
        'summary',
        'evidence',
        'sources',
        'period',
        'type',
    ];

    protected $casts = [
        'sources' => 'array',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'fact_check_user')->withTimestamps();
    }
}
