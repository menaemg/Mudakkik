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
    ];

    protected $casts = [
        'sources' => 'array',
    ];

}
