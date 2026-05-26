<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappAccount extends Model
{
    protected $fillable = [
        'owner_email',
        'owner_name',
        'display_phone',
        'phone_number_id',
        'business_account_id',
        'access_token',
        'verify_token',
        'status'
    ];

    protected $hidden = ['access_token'];

    public function conversations()
    {
        return $this->hasMany(WhatsappConversation::class);
    }
}
