<?php

namespace App\Http\Controllers\Archive;

use App\Http\Controllers\Controller;
use App\Models\Rfo;
use Inertia\Inertia;

class RfoController extends Controller
{
    public function index()
    {
        $rfos = Rfo::select('document_no', 'title_subject', 'origin_office', 'date_time_received_incoming', 'doc_type', 'sender', 'remarks')->get();

        return Inertia::render('document/archive/rfo/index', [
            'rfos' => $rfos
        ]);
    }
}
