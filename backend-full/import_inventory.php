<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

$file = storage_path('app/kfcl_inventory_import.csv');

if (!file_exists($file)) {
    die("ERROR: CSV file not found at: $file\n");
}

$rows = array_map('str_getcsv', file($file));
$header = array_map('trim', array_shift($rows));

$count = 0;

foreach ($rows as $row) {
    if (count($row) !== count($header)) {
        continue;
    }

    $data = array_combine($header, $row);

    Product::updateOrCreate(
        ['sku' => $data['sku']],
        [
            'name' => $data['name'],
            'category' => $data['category'],
            'price' => (float) $data['price'],
            'stock' => (int) $data['stock'],
            'status' => $data['status'],
        ]
    );

    $count++;
}

echo "SUCCESS\n";
echo "Imported/updated products: {$count}\n";
echo "Total products in database: " . Product::count() . "\n";
