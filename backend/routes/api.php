<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\SaleOrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\WooCommerceSyncController;

Route::get('/health', fn () => response()->json(['status' => 'online']));
Route::get('/dashboard', [DashboardController::class, 'index']);

Route::apiResource('customers', CustomerController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('leads', LeadController::class);
Route::apiResource('sales-orders', SaleOrderController::class);
Route::apiResource('payments', PaymentController::class);

Route::post('/woocommerce/sync-products', [WooCommerceSyncController::class, 'syncProducts']);
