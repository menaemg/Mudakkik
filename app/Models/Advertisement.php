<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Advertisement extends Model
{
use HasFactory;
    protected $fillable = ['user_id', 
    'title',
     'image_url', 
     'target_link', 
     'start_date', 
     'end_date',
      'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
