<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = Product::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(fn($x) =>
                $x->where('name','like',"%$s%")
                  ->orWhere('sku','like',"%$s%")
                  ->orWhere('category','like',"%$s%")
            );
        }

        if ($request->filled('category') && $request->category !== 'All') {
            $q->where('category', $request->category);
        }

        return $q->orderBy('name')->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|string',
            'sku'=>'nullable|string',
            'category'=>'nullable|string',
            'stock_qty'=>'nullable|numeric',
            'selling_price'=>'nullable|numeric',
            'qty'=>'nullable|numeric',
            'unit_price'=>'nullable|numeric',
        ]);

        $stockQty = (int)($data['stock_qty'] ?? 0);
        $sellingPrice = (float)($data['selling_price'] ?? 0);

        $product = Product::create([
            'name'=>$data['name'],
            'sku'=>$data['sku'] ?? 'KFCL-' . strtoupper(substr(md5($data['name']),0,8)),
            'category'=>$data['category'] ?? 'Agro-inputs',
            'stock_qty'=>$stockQty,
            'selling_price'=>$sellingPrice,
            'qty'=>(int)($data['qty'] ?? $stockQty),
            'unit_price'=>(float)($data['unit_price'] ?? $sellingPrice),
            'stock'=>$stockQty,
            'price'=>$sellingPrice,
            'status'=>$stockQty <= 10 ? 'Low Stock' : 'In Stock',
        ]);

        return response()->json($product);
    }

    public function import(Request $request)
    {
        $request->validate(['file'=>'required|file|mimes:csv,xlsx,xls']);

        $path = $request->file('file')->getRealPath();
        $sheet = IOFactory::load($path)->getActiveSheet();
        $rows = $sheet->toArray();

        $headers = array_map(fn($h)=>strtolower(trim($h)), array_shift($rows));

        $imported = 0;

        foreach ($rows as $row) {
            if (count($row) < 2) continue;

            $data = array_combine($headers, array_pad($row, count($headers), null));

            $name = trim($data['name'] ?? $data['product'] ?? $data['product name'] ?? $data['item'] ?? '');
            if (!$name) continue;

            $sku = trim($data['sku'] ?? $data['code'] ?? 'KFCL-' . strtoupper(substr(md5($name),0,8)));
            $category = trim($data['category'] ?? $data['type'] ?? 'Agro-inputs');

            $stockQty = (int)preg_replace('/[^0-9]/','', $data['stock qty'] ?? $data['stock'] ?? $data['qty'] ?? $data['quantity'] ?? 0);
            $sellingPrice = (float)preg_replace('/[^0-9.]/','', $data['selling price'] ?? $data['price'] ?? $data['unit price'] ?? 0);
            $qty = (int)preg_replace('/[^0-9]/','', $data['qty'] ?? $stockQty);
            $unitPrice = (float)preg_replace('/[^0-9.]/','', $data['unit price'] ?? $sellingPrice);

            Product::updateOrCreate(
                ['sku'=>$sku],
                [
                    'name'=>$name,
                    'category'=>$category,
                    'stock_qty'=>$stockQty,
                    'selling_price'=>$sellingPrice,
                    'qty'=>$qty,
                    'unit_price'=>$unitPrice,
                    'stock'=>$stockQty,
                    'price'=>$sellingPrice,
                    'status'=>$stockQty <= 10 ? 'Low Stock' : 'In Stock',
                ]
            );

            $imported++;
        }

        return response()->json([
            'success'=>true,
            'imported'=>$imported,
            'total_products'=>Product::count(),
            'total_stock_qty'=>Product::sum('stock_qty'),
            'stock_value'=>Product::sum(DB::raw('stock_qty * selling_price')),
        ]);
    }

    public function stats()
    {
        return response()->json([
            'total_products'=>Product::count(),
            'total_stock_qty'=>Product::sum('stock_qty'),
            'total_qty'=>Product::sum('qty'),
            'stock_value'=>Product::sum(DB::raw('stock_qty * selling_price')),
            'low_stock'=>Product::where('stock_qty','<=',10)->count(),
            'categories'=>Product::select('category')->distinct()->pluck('category')
        ]);
    }
}
