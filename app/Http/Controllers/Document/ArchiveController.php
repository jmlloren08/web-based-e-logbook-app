<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        $archives = Archive::latest()->paginate(10);

        return Inertia::render('document/archive/index', [
            'archives' => $archives
        ]);
    }
}
