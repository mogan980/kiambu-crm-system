<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SaleOrder;
use Illuminate\Http\Request;

class SaleOrderController extends Controller
{
    public function index()
    {
        return SaleOrder::latest()->paginate(20);
    }

    public function store(Request $request)
    {
        return SaleOrder::create($request->all());
    }

    public function show(SaleOrder $sale_order)
    {
        return $sale_order;
    }

    public function update(Request $request, SaleOrder $sale_order)
    {
        $sale_order->update($request->all());
        return $sale_order;
    }

    public function destroy(SaleOrder $sale_order)
    {
        $sale_order->delete();
        return response()->json(['deleted' => true]);
    }
}
