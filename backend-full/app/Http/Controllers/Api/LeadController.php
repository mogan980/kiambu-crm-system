<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        return Lead::latest()->paginate(20);
    }

    public function store(Request $request)
    {
        return Lead::create($request->all());
    }

    public function show(Lead $lead)
    {
        return $lead;
    }

    public function update(Request $request, Lead $lead)
    {
        $lead->update($request->all());
        return $lead;
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(['deleted' => true]);
    }
}
