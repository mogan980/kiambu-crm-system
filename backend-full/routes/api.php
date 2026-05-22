<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;

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
