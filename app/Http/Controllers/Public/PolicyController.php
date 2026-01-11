<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use Inertia\Inertia;

class PolicyController extends Controller
{

    public function index()
    {
        $policies = Policy::all();
        return Inertia::render('Public/Terms', [
            'policies' => $policies
        ]);
    }
    public function privacy()
    {
        return Inertia::render('Public/Privacy');
    }
    public function faq()
    {
        return Inertia::render('Public/FAQ');
    }
}
