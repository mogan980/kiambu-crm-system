<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappMessage extends Model
{
    protected $fillable = [
        'whatsapp_conversation_id',
        'sender_type',
        'message',
        'status',
        'wa_message_id'
    ];
}
