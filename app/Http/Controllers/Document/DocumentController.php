<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with(['incomingDocument', 'outgoingDocument'])
            ->latest()
            ->paginate(10);

        return response()->json($documents);
    }
}
