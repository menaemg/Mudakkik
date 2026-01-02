<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustedDomain extends Model
{
    
    protected $fillable = [
        'name',
        'domain',
        'is_active'
    ];
}
