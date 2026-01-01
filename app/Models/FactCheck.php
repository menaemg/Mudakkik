<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactCheck extends Model
{
    protected $fillable = [
        'user_input',
        'verdict',
        'confidence_score',
        'ai_explantion',
        'evidence_source',
        'user_input',
        'user_id'
    ];

    protected $casts = [
        'evidence_source'=>'array',
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
