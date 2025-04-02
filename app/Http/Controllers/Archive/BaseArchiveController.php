<?php

namespace App\Http\Controllers\Archive;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use Inertia\Inertia;

abstract class BaseArchiveController extends Controller
{
    protected $officeName;

    public function __construct()
    {
        $this->initializeOffice();
    }

    abstract protected function initializeOffice();

    /**
     * Displays the list of documents for the office.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get the list of documents for the office
        $documents = Archive::where('origin_office', 'LIKE', $this->officeName . '%')
            ->orderBy('updated_at', 'desc')
            ->get();
        // Pass the data to the view
        return Inertia::render('document/archive/index', [
            'documents' => $documents
        ]);
    }
}
