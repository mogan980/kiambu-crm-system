<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('whatsapp_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('owner_email')->index();
            $table->string('owner_name')->nullable();
            $table->string('display_phone')->nullable();
            $table->string('phone_number_id')->nullable();
            $table->string('business_account_id')->nullable();
            $table->text('access_token')->nullable();
            $table->string('verify_token')->nullable();
            $table->string('status')->default('Disconnected');
            $table->timestamps();
        });

        Schema::create('whatsapp_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('whatsapp_account_id')->constrained()->cascadeOnDelete();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->index();
            $table->integer('unread')->default(0);
            $table->timestamps();
        });

        Schema::create('whatsapp_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('whatsapp_conversation_id')->constrained()->cascadeOnDelete();
            $table->string('sender_type')->default('admin');
            $table->text('message');
            $table->string('status')->default('saved');
            $table->string('wa_message_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('whatsapp_messages');
        Schema::dropIfExists('whatsapp_conversations');
        Schema::dropIfExists('whatsapp_accounts');
    }
};
