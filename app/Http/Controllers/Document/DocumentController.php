<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with(['currentState'])
            ->latest()
            ->paginate(10);

        return response()->json($documents);
    }
    public function returnDocumentFor(Request $request, $id)
    {
        try {
            $request->validate([
                'comments' => 'required|string|max:255',
                'return_reason' => 'required|string|max:255',
            ]);
            // Find the document
            $document = Document::findOrFail($id);
            // Make sure document is in a state that can be returned
            if (!in_array($document->current_state_id, [2, 3])) { // sent, received
                return redirect()->back()->with('error', 'Document cannot be returned from its current state.');
            }
            // return for revision
            $metadata = [
                'return_reason' => $request->return_reason,
                'return_by' => auth()->user()->name ?? 'System',
                'return_date' => now()->toDateTimeString(),
            ];

            $document->returnDocumentFor('Document has been returned: ' . $request->comments, $metadata);

            return redirect()->route('incoming-documents.index', $document)->with('success', 'Document has been returned to recipient.');
        } catch (\Exception $e) {
            Log::error('Document Return Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error returning document: ' . $e->getMessage());
        }
    }
    public function submitRevision(Request $request, $id)
    {
        try {
            $request->validate([
                'title_subject' => 'required|string',
                'docs_types' => 'required|string',
                'other_ref_no' => 'nullable|string',
                'date_time_received' => 'required',
                'from_office_department_unit' => 'required',
                'sender_name' => 'required',
                'instructions_action_requested' => 'required',
                'revision_comments' => 'required|string',
                'date_released' => 'required|date',
                'forwarded_to_office_department_unit' => 'required|string',
            ]);
            // Find the document
            $document = Document::with('incomingDocument', 'outgoingDocument')->findOrFail($id);
            // Make sure document is in returned for revision state
            if ($document->current_state_id != 4) { // returned
                return redirect()->back()->with('error', 'Document is not in revision state');
            }
            // Update the document
            $document->update([
                'title_subject' => $request->title_subject,
                'docs_types' => $request->docs_types,
            ]);
            // Update the incoming document
            // $incomingDocument = IncomingDocument::where('document_id', $id)->first();
            if ($document->incomingDocument) {
                $document->incomingDocument->update([
                    'other_ref_no' => $request->other_ref_no,
                    'date_time_received' => $request->date_time_received,
                    'from_office_department_unit' => $request->from_office_department_unit,
                    'sender_name' => $request->sender_name,
                    'instructions_action_requested' => $request->instructions_action_requested,
                ]);
            }
            // Add revised state to document history
            $document->addHistoryEvent(5, 'Document has been revised: ' . $request->revision_comments, [
                'other_ref_no' => $request->other_ref_no,
                'date_time_received' => $request->date_time_received,
                'from_office_department_unit' => $request->from_office_department_unit,
                'sender_name' => $request->sender_name,
                'instructions_action_requested' => $request->instructions_action_requested,
                'revision_comments' => $request->revision_comments,
            ]);
            // Create or update outgoing document with new information
            $outgoingMeta = [
                'date_released' => $request->date_released,
                'forwarded_to_office_department_unit' => $request->forwarded_to_office_department_unit,
            ];
            // $outgoingDocument = OutgoingDocument::where('document_id', $id)->first();
            if ($document->outgoingDocument) {
                $document->outgoingDocument->update([
                    'forwarded_to_office_department_unit' => $request->forwarded_to_office_department_unit,
                    'received_by' => null,
                    'date_time_received' => null,
                    'remarks' => null,
                    'signature_path' => null,
                ]);
            }
            // Send the revised document
            $document->sendRevised($outgoingMeta);
            return redirect()->route('outgoing-documents.index', $document)->with('success', 'Forwarded to ' . $outgoingMeta['forwarded_to_office_department_unit'] . ' successfully.');
        } catch (\Exception $e) {
            Log::error('Submit Revision Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error submitting document for revision: ' . $e->getMessage());
        }
    }
    public function finalizeDocument(Request $request, $id)
    {
        try {
            $request->validate([
                'comments' => 'nullable|string|max:1000',
            ]);
            // Find the document
            $document = Document::findOrFail($id);
            // Make sure document is in a state that can be finalized
            if ($document->current_state_id != 3) { // received
                return redirect()->back()->with('error', 'Document must be received before finalizing.');
            }

            $metadata = [
                'finalized_link' => $request->comments,
                'finalized_by' => auth()->user()->name ?? 'System',
                'finalized_date' => now()->toDateTimeString(),
            ];
            // Finalize the document
            $document->finalizeDocument('Document has been finalized and completed.', $metadata);

            return redirect()->route('outgoing-documents.index', $document)->with('success', 'Document has been finalized.');
        } catch (\Exception $e) {
            Log::error('Document Finalize Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error finalizing document: ' . $e->getMessage());
        }
    }
    public function signedDocuments(Request $request)
    {
        try {
            $query = Document::with(['currentState', 'outgoingDocument'])
                ->whereIn('current_state_id', [6]); // finalized and completed
            // Handle search if search parameter is provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('document_no', 'like', "%{$searchTerm}%")
                        ->orWhere('title_subject', 'like', "%{$searchTerm}%")
                        ->orWhereHas('outgoingDocument', function ($q) use ($searchTerm) {
                            $q->where('forwarded_to_office_department_unit', 'like', "%{$searchTerm}%")
                                ->orWhere('received_by', 'like', "%{$searchTerm}%")
                                ->orWhere('remarks', 'like', "%{$searchTerm}%");
                        });
                });
            }
            // Handle tab filtering if tab parameter is provided and not 'all'
            if ($request->has('tab') && $request->tab !== 'all') {
                $tabValue = $request->tab;
                $query->where('document_no', 'like', "%{$tabValue}%");
            }
            $documents = $query->latest('updated_at')->paginate(10);
            return Inertia::render('document/signed-documents', ['documents' => $documents]);
        } catch (\Exception $e) {
            Log::error('Document Index Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
