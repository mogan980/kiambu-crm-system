<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku','name','category',
        'stock_qty','selling_price','qty','unit_price',
        'stock','price','status'
    ];
}
