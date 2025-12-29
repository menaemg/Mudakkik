<?php
use App\Http\Controllers\Controller;
use App\Models\UpgreadRequest;
use Inertia\Inertia;
namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

class JoinRequestController extends Controller
{
    //
         public function index(Request $request)
    {
        $requests = UpgreadRequest::latest()
            ->with('user')
            ->filter($request)
            ->paginate(10)
            ->withQueryString()
            ;

        return Inertia::render('Admin/Requests/Join', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}