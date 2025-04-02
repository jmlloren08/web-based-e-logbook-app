<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index()
    {
        $archives = Archive::select('document_no', 'title_subject', 'origin_office', 'date_time_received_incoming', 'doc_type', 'sender', 'remarks')->get();

        return Inertia::render('document/archive/rfo/index', [
            'archives' => $archives
        ]);
    }
}
