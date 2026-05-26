<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Models\Product;

Route::get('/products', function () {
    return Product::paginate(10);
});

Route::get('/dashboard', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Kiambu CRM Backend Working',
        'customers' => \App\Models\Customer::count(),
        'products' => \App\Models\Product::count(),
        'leads' => 18,
        'orders' => 0,
        'revenue' => 45000,
        'low_stock' => \App\Models\Product::where('stock', '<=', 10)->count()
    ]);
});

Route::apiResource('customers', CustomerController::class);
Route::get('/products/stats', [ProductController::class, 'stats']);
Route::get('/products', [ProductController::class, 'index']);

use App\Http\Controllers\Api\WhatsappController;

Route::prefix('whatsapp')->group(function () {
    Route::get('/account', [WhatsappController::class, 'account']);
    Route::post('/connect', [WhatsappController::class, 'connect']);
    Route::get('/conversations', [WhatsappController::class, 'conversations']);
    Route::post('/send', [WhatsappController::class, 'send']);
    Route::get('/webhook', [WhatsappController::class, 'webhookVerify']);
    Route::post('/webhook', [WhatsappController::class, 'webhookReceive']);
});

Route::post('/products/import', [\App\Http\Controllers\Api\ProductController::class, 'import']);
Route::post('/products', [\App\Http\Controllers\Api\ProductController::class, 'store']);
