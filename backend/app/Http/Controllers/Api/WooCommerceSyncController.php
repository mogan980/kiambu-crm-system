<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class WooCommerceSyncController extends Controller
{
    public function syncProducts()
    {
        return response()->json([
            'message' => 'WooCommerce sync placeholder ready. Add WooCommerce REST API keys later.'
        ]);
    }
}
