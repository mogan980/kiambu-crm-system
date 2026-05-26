<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'stock_qty')) {
                $table->integer('stock_qty')->default(0);
            }

            if (!Schema::hasColumn('products', 'selling_price')) {
                $table->decimal('selling_price', 12, 2)->default(0);
            }

            if (!Schema::hasColumn('products', 'qty')) {
                $table->integer('qty')->default(0);
            }

            if (!Schema::hasColumn('products', 'unit_price')) {
                $table->decimal('unit_price', 12, 2)->default(0);
            }
        });
    }

    public function down(): void {}
};
