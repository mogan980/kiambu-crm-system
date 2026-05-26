<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WhatsappAccount;
use App\Models\WhatsappConversation;
use App\Models\WhatsappMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

class WhatsappController extends Controller
{
    private function normalizePhone($phone)
    {
        $phone = preg_replace('/\D/', '', $phone ?? '');

        if (str_starts_with($phone, '0')) {
            $phone = '254' . substr($phone, 1);
        }

        if (!str_starts_with($phone, '254') && strlen($phone) === 9) {
            $phone = '254' . $phone;
        }

        return $phone;
    }

    private function getOwner(Request $request)
    {
        return [
            'email' => $request->input('owner_email') ?? $request->query('owner_email') ?? 'admin@crm.local',
            'name' => $request->input('owner_name') ?? $request->query('owner_name') ?? 'Admin'
        ];
    }

    public function account(Request $request)
    {
        $owner = $this->getOwner($request);

        $account = WhatsappAccount::where('owner_email', $owner['email'])->first();

        return response()->json([
            'connected' => $account && $account->status === 'Connected',
            'account' => $account
        ]);
    }

    public function connect(Request $request)
    {
        $data = $request->validate([
            'owner_email' => 'required|string',
            'owner_name' => 'nullable|string',
            'display_phone' => 'required|string',
            'phone_number_id' => 'required|string',
            'business_account_id' => 'nullable|string',
            'access_token' => 'required|string',
            'verify_token' => 'nullable|string',
        ]);

        $account = WhatsappAccount::updateOrCreate(
            ['owner_email' => $data['owner_email']],
            [
                'owner_name' => $data['owner_name'] ?? 'Admin',
                'display_phone' => $data['display_phone'],
                'phone_number_id' => $data['phone_number_id'],
                'business_account_id' => $data['business_account_id'] ?? '',
                'access_token' => Crypt::encryptString($data['access_token']),
                'verify_token' => $data['verify_token'] ?? 'hakim_crm_verify_token',
                'status' => 'Connected',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'WhatsApp account connected successfully',
            'account' => $account
        ]);
    }

    public function conversations(Request $request)
    {
        $owner = $this->getOwner($request);

        $account = WhatsappAccount::where('owner_email', $owner['email'])->first();

        if (!$account) {
            return response()->json([
                'connected' => false,
                'conversations' => []
            ]);
        }

        $conversations = WhatsappConversation::where('whatsapp_account_id', $account->id)
            ->with('messages')
            ->latest()
            ->get();

        return response()->json([
            'connected' => true,
            'account' => $account,
            'conversations' => $conversations
        ]);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'owner_email' => 'required|string',
            'owner_name' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        $account = WhatsappAccount::where('owner_email', $data['owner_email'])->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'No WhatsApp account connected for this user'
            ], 422);
        }

        $phone = $this->normalizePhone($data['phone']);

        $conversation = WhatsappConversation::firstOrCreate(
            [
                'whatsapp_account_id' => $account->id,
                'customer_phone' => $phone
            ],
            [
                'customer_name' => $data['customer_name'] ?? $phone,
                'unread' => 0
            ]
        );

        $message = WhatsappMessage::create([
            'whatsapp_conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'message' => $data['message'],
            'status' => 'pending'
        ]);

        try {
            $token = Crypt::decryptString($account->access_token);

            $response = Http::withToken($token)->post(
                'https://graph.facebook.com/v19.0/' . $account->phone_number_id . '/messages',
                [
                    'messaging_product' => 'whatsapp',
                    'to' => $phone,
                    'type' => 'text',
                    'text' => [
                        'body' => $data['message']
                    ]
                ]
            );

            if ($response->successful()) {
                $json = $response->json();

                $message->update([
                    'status' => 'sent',
                    'wa_message_id' => $json['messages'][0]['id'] ?? null
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Message sent through WhatsApp Cloud API',
                    'conversation' => $conversation->load('messages')
                ]);
            }

            $message->update(['status' => 'failed']);

            return response()->json([
                'success' => false,
                'message' => 'WhatsApp API failed',
                'error' => $response->json(),
                'conversation' => $conversation->load('messages')
            ], 422);

        } catch (\Throwable $e) {
            $message->update(['status' => 'failed']);

            return response()->json([
                'success' => false,
                'message' => 'Message saved but WhatsApp sending failed',
                'error' => $e->getMessage(),
                'conversation' => $conversation->load('messages')
            ], 500);
        }
    }

    public function webhookVerify(Request $request)
    {
        $mode = $request->query('hub_mode') ?? $request->query('hub.mode');
        $token = $request->query('hub_verify_token') ?? $request->query('hub.verify_token');
        $challenge = $request->query('hub_challenge') ?? $request->query('hub.challenge');

        $account = WhatsappAccount::where('verify_token', $token)->first();

        if ($mode === 'subscribe' && $account) {
            return response($challenge, 200);
        }

        return response('Forbidden', 403);
    }

    public function webhookReceive(Request $request)
    {
        $payload = $request->all();

        $change = $payload['entry'][0]['changes'][0]['value'] ?? null;
        $messageData = $change['messages'][0] ?? null;
        $phoneNumberId = $change['metadata']['phone_number_id'] ?? null;

        if (!$messageData || !$phoneNumberId) {
            return response()->json(['received' => true]);
        }

        $account = WhatsappAccount::where('phone_number_id', $phoneNumberId)->first();

        if (!$account) {
            return response()->json(['received' => true]);
        }

        $from = $this->normalizePhone($messageData['from'] ?? '');
        $text = $messageData['text']['body'] ?? '[Unsupported message type]';

        $conversation = WhatsappConversation::firstOrCreate(
            [
                'whatsapp_account_id' => $account->id,
                'customer_phone' => $from
            ],
            [
                'customer_name' => $from,
                'unread' => 0
            ]
        );

        $conversation->increment('unread');

        WhatsappMessage::create([
            'whatsapp_conversation_id' => $conversation->id,
            'sender_type' => 'customer',
            'message' => $text,
            'status' => 'received',
            'wa_message_id' => $messageData['id'] ?? null
        ]);

        return response()->json(['received' => true]);
    }
}
