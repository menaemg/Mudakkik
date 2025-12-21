<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Advertisment;
use App\Models\User;
use App\Models\Subscription;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'ad_id',
        'subscription_id',
        'amount',
        'payment_method',
        'transaction_id',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function ad()
    {
        return $this->belongsTo(Advertisment::class);
    }
    public function Subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
