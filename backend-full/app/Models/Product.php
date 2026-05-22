<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['sku','name','category','unit','buying_price','selling_price','stock_quantity','stock_status','description'];
}
