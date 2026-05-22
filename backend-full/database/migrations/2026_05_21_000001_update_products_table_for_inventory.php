<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'sku')) $table->string('sku')->nullable()->after('id');
            if (!Schema::hasColumn('products', 'stock')) $table->integer('stock')->default(0);
            if (!Schema::hasColumn('products', 'price')) $table->decimal('price', 12, 2)->default(0);
            if (!Schema::hasColumn('products', 'category')) $table->string('category')->nullable();
            if (!Schema::hasColumn('products', 'status')) $table->string('status')->default('In Stock');
        });
    }

    public function down(): void {}
};
