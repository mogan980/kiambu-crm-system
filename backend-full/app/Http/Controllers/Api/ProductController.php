<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        return $query->orderBy('name')->paginate(30);
    }

    public function stats()
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_stock' => Product::sum('stock'),
            'stock_value' => Product::sum(\DB::raw('price * stock')),
            'low_stock' => Product::where('stock', '<=', 10)->count(),
            'categories' => Product::select('category')->distinct()->pluck('category')
        ]);
    }
}
