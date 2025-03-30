<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\IncomingDocument;
use App\Models\OutgoingDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Get total counts
            $totalIncoming = Document::whereHas('incomingDocument')
                ->whereDoesntHave('outgoingDocument')
                ->count();
            $totalOutgoing = Document::whereHas('outgoingDocument')->count();
            $totalPending = Document::whereHas('outgoingDocument', function ($query) {
                $query->whereNull('date_time_received');
            })->count();

            // Get recent documents for each tab
            $recentDocuments = [
                'all' => Document::select('document_no', 'title_subject', 'docs_types', 'updated_at')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($document) {
                        return [
                            'id' => $document->id,
                            'document_no' => $document->document_no,
                            'title_subject' => $document->title_subject,
                            'docs_types' => $document->docs_types,
                            'date' => $document->updated_at,
                        ];
                    }),

                'incoming' => IncomingDocument::with('document')
                    ->whereHas('document.outgoingDocument', function ($query) {
                        $query->whereNotNull('outgoing_documents.date_released');
                    })
                    ->latest('incoming_documents.date_time_received')
                    ->take(5)
                    ->get()
                    ->map(function ($incoming) {
                        return [
                            'id' => $incoming->document->id,
                            'document_no' => $incoming->document->document_no,
                            'title_subject' => $incoming->document->title_subject,
                            'docs_types' => $incoming->document->docs_types,
                            'date' => $incoming->date_time_received,
                        ];
                    }),

                'outgoing' => OutgoingDocument::with('document')
                    ->whereNotNull('date_time_received')
                    ->whereNotNull('signature_path')
                    ->latest('outgoing_documents.date_released')
                    ->take(5)
                    ->get()
                    ->map(function ($outgoing) {
                        return [
                            'id' => $outgoing->document->id,
                            'document_no' => $outgoing->document->document_no,
                            'title_subject' => $outgoing->document->title_subject,
                            'docs_types' => $outgoing->document->docs_types,
                            'date' => $outgoing->date_time_received,
                        ];
                    }),
            ];

            return Inertia::render('dashboard', [
                'stats' => [
                    'totalIncoming' => $totalIncoming,
                    'totalOutgoing' => $totalOutgoing,
                    'totalPending' => $totalPending,
                ],
                'recentDocuments' => $recentDocuments,
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
