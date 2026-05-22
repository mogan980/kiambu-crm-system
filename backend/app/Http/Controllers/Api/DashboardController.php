<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Lead;
use App\Models\SaleOrder;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'customers' => Customer::count(),
            'products' => Product::count(),
            'leads' => Lead::count(),
            'orders' => SaleOrder::count(),
            'revenue' => Payment::where('status', 'paid')->sum('amount'),
            'low_stock' => Product::where('stock_quantity', '<=', 5)->count(),
        ]);
    }
}
