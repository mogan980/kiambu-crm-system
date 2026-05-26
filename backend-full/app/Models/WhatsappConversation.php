<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappConversation extends Model
{
    protected $fillable = [
        'whatsapp_account_id',
        'customer_name',
        'customer_phone',
        'unread'
    ];

    public function messages()
    {
        return $this->hasMany(WhatsappMessage::class)->orderBy('created_at');
    }
}
