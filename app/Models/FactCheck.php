<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactCheck extends Model
{

   protected $guarded = []; 

    protected $casts = [
        'sources' => 'array',
    ];

}
