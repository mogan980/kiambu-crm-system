<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

$file = storage_path('app/kfcl_inventory_import.csv');

if (!file_exists($file)) {
    die("CSV not found: $file\n");
}

$rows = array_map('str_getcsv', file($file));
$header = array_map('trim', array_shift($rows));

$updated = 0;

foreach ($rows as $row) {
    if (count($row) !== count($header)) continue;

    $data = array_combine($header, $row);

    $sku = trim($data['sku'] ?? '');
    $name = trim($data['name'] ?? '');

    $price = (float) preg_replace('/[^0-9.]/', '', $data['price'] ?? 0);
    $stock = (int) preg_replace('/[^0-9]/', '', $data['stock'] ?? 0);

    if (!$sku && !$name) continue;

    Product::updateOrCreate(
        ['sku' => $sku],
        [
            'name' => $name,
            'category' => trim($data['category'] ?? 'Agro-inputs'),
            'price' => $price,
            'stock' => $stock,
            'status' => $stock <= 10 ? 'Low Stock' : 'In Stock',
        ]
    );

    $updated++;
}

echo "Prices and stock updated successfully\n";
echo "Updated rows: $updated\n";
echo "Total products: " . Product::count() . "\n";
echo "Total stock: " . Product::sum('stock') . "\n";
echo "Stock value: KES " . number_format(Product::sum(DB::raw('price * stock')), 2) . "\n";
