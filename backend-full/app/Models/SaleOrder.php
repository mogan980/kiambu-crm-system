<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleOrder extends Model
{
    protected $fillable = ['customer_id','order_number','status','payment_status','total_amount','delivery_status','notes'];
}
