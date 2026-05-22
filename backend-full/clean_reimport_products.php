<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;
use Illuminate\Support\Facades\DB;

$file = storage_path('app/kfcl_inventory_import.csv');

if (!file_exists($file)) {
    die("CSV not found: $file\n");
}

DB::table('products')->truncate();

$rows = array_map('str_getcsv', file($file));
$header = array_map('trim', array_shift($rows));

$count = 0;

foreach ($rows as $row) {
    if (count($row) !== count($header)) continue;

    $data = array_combine($header, $row);

    Product::create([
        'sku' => trim($data['sku'] ?? ''),
        'name' => trim($data['name'] ?? ''),
        'category' => trim($data['category'] ?? 'Agro-inputs'),
        'price' => (float) preg_replace('/[^0-9.]/', '', $data['price'] ?? 0),
        'stock' => (int) preg_replace('/[^0-9]/', '', $data['stock'] ?? 0),
        'status' => ((int) preg_replace('/[^0-9]/', '', $data['stock'] ?? 0)) <= 10 ? 'Low Stock' : 'In Stock',
    ]);

    $count++;
}

echo "Clean re-import complete\n";
echo "Products imported: $count\n";
echo "Total stock: " . Product::sum('stock') . "\n";
echo "Stock value: KES " . number_format(Product::sum(DB::raw('price * stock')), 2) . "\n";
