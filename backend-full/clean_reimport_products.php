<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;
use Illuminate\Support\Facades\DB;

$file = storage_path('app/kfcl_inventory_import.csv');

DB::table('products')->truncate();

$rows = array_map('str_getcsv', file($file));
$headers = array_map(fn($h) => strtolower(trim($h)), array_shift($rows));

$count = 0;
$totalStock = 0;
$totalValue = 0;

foreach ($rows as $row) {
    if (count($row) !== count($headers)) continue;

    $data = array_combine($headers, $row);

    $name = trim($data['name'] ?? $data['product'] ?? $data['product name'] ?? '');
    if (!$name) continue;

    $sku = trim($data['sku'] ?? 'KFCL-' . strtoupper(substr(md5($name), 0, 8)));
    $category = trim($data['category'] ?? 'Agro-inputs');

    $stockQty = (int) preg_replace('/[^0-9]/', '', 
        $data['stock qty'] ?? $data['qty'] ?? $data['quantity'] ?? $data['stock'] ?? 0
    );

    $sellingPrice = (float) preg_replace('/[^0-9.]/', '', 
        $data['selling price'] ?? $data['unit price'] ?? $data['price'] ?? 0
    );

    Product::create([
        'sku' => $sku,
        'name' => $name,
        'category' => $category,
        'stock_qty' => $stockQty,
        'selling_price' => $sellingPrice,
        'qty' => $stockQty,
        'unit_price' => $sellingPrice,
        'stock' => $stockQty,
        'price' => $sellingPrice,
        'status' => $stockQty <= 10 ? 'Low Stock' : 'In Stock',
    ]);

    $count++;
    $totalStock += $stockQty;
    $totalValue += ($sellingPrice * $stockQty);
}

echo "Imported: $count\n";
echo "Total Stock Qty: " . number_format($totalStock) . "\n";
echo "Stock Value: KES " . number_format($totalValue, 2) . "\n";
