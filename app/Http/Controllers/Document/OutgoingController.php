<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\IncomingDocument;
use App\Models\OutgoingDocument;
use App\Models\Recipients;
use App\Models\Remarks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OutgoingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Document::with(['currentState', 'outgoingDocument'])
                ->whereIn('current_state_id', [2, 3]); // sent, received
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
            return Inertia::render('document/outgoing/index', ['documents' => $documents]);
        } catch (\Exception $e) {
            Log::error('Document Index Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function modify(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'received_by' => 'required|string|max:255',
                'date_time_received' => 'required|date',
                'remarks' => 'nullable|string',
            ]);
            $outgoingDocument = OutgoingDocument::findOrFail($id);
            // Update outgoing document without signature_path
            $outgoingDocument->update($validatedData);
            return redirect()->route('outgoing-documents.index')->with('success', 'Document modified successfully');
        } catch (\Exception $e) {
            Log::error('Document Modify Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'received_by' => 'required|string|max:255',
                'date_time_received' => 'required|date',
                'remarks' => 'nullable|string',
                'signature_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
            $document = Document::with('outgoingDocument')->findOrFail($id);
            // Handle signature upload if provided
            if ($request->hasFile('signature_path')) {
                $signaturePath = $request->file('signature_path')->store('signatures', 'public');
                $validatedData['signature_path'] = $signaturePath;
            }
            // Update outgoing document
            $document->outgoingDocument->update($validatedData);
            // Update document state
            $document->current_state_id = 3; // received
            $document->save();
            // Add history event
            $document->addHistoryEvent(3, 'Document has been received by recipient.', [
                'received_by' => $validatedData['received_by'],
                'date_time_received' => $validatedData['date_time_received'],
                'remarks' => $validatedData['remarks'] ?? null,
                'signature_path' => $validatedData['signature_path'],
            ]);
            return redirect()->route('outgoing-documents.index')->with('success', 'Received document by ' . $validatedData['received_by'] . ' successfully.');
        } catch (\Exception $e) {
            Log::error('Document Log Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function receiveBulkDocuments(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'received_by' => 'required|string|max:255',
                'date_time_received' => 'required|date',
                'remarks' => 'nullable|string',
                'signature_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'document_ids' => 'required|array',
                'document_ids.*' => 'required|string|exists:documents,id',
            ]);
            Log::info('Bulk Update Data: ', $validatedData);
            // Handle signature upload if provided
            if ($request->hasFile('signature_path')) {
                $signaturePath = $request->file('signature_path')->store('signatures', 'public');
                $validatedData['signature_path'] = $signaturePath;
            }
            // Update each document
            foreach ($validatedData['document_ids'] as $documentId) {
                $document = Document::with('outgoingDocument')->findOrFail($documentId);
                // Update outgoing document
                $document->outgoingDocument->update([
                    'received_by' => $validatedData['received_by'],
                    'date_time_received' => $validatedData['date_time_received'],
                    'remarks' => $validatedData['remarks'] ?? null,
                    'signature_path' => $validatedData['signature_path'],
                ]);
                // Update document state
                $document->current_state_id = 3; // received
                $document->save();
                // Add history event
                $document->addHistoryEvent(3, 'Document has been received by recipient.', [
                    'received_by' => $validatedData['received_by'],
                    'date_time_received' => $validatedData['date_time_received'],
                    'remarks' => $validatedData['remarks'] ?? null,
                    'signature_path' => $validatedData['signature_path'],
                ]);
            }

            return redirect()->route('outgoing-documents.index')->with('success', 'Received ' . count($validatedData['document_ids']) . ' documents successfully.');
        } catch (\Exception $e) {
            Log::error('Bulk Document Update Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function getRecipientsForReceive()
    {
        try {
            $recipients = Recipients::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            return response()->json($recipients);
        } catch (\Exception $e) {
            Log::error('Error fetching recipients: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
    public function getRemarksForReceive()
    {
        try {
            $remarks = Remarks::select('id', 'name')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            return response()->json($remarks);
        } catch (\Exception $e) {
            Log::error('Error fetching remarks: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
    public function show($id)
    {
        try {
            $document = Document::with(['currentState', 'history.state', 'history.user'])->findOrFail($id);
            // Get the latest outgoing document
            $outgoingDocument = OutgoingDocument::where('document_id', $document->$id)
                ->latest()
                ->first();
            // Get the original incoming document
            $incomingDocument = IncomingDocument::where('document_id', $document->$id)->first();
            // Format history events for the timeline
            $historyEvents = $document->history->map(function ($event) {
                $user = $event->user;
                return [
                    'id' => $event->id,
                    // 'state_id' => $event->document_state_id,
                    'state' => $event->state->name,
                    'user' => $user ? [
                        'name' => $user->name,
                        'role' => $user->role ?? null,
                    ] : null,
                    'timestamp' => $event->timestamp,
                    'comments' => $event->comments,
                    'metadata' => $event->metadata,
                    'revision_number' => $event->revision_number,
                    'is_current' => $event->is_current,
                ];
            });
            return Inertia::render('document/outgoing/show', [
                'document' => $document,
                'incomingDocument' => $incomingDocument,
                'outgoingDocument' => $outgoingDocument,
                'historyEvents' => $historyEvents,
            ]);
        } catch (\Exception $e) {
            Log::error('Document Show Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Document not found.');
        }
    }
    public function destroy(Document $document)
    {
        try {
            $document->delete();
            return redirect()->route('outgoing-documents.index')->with('success', 'Document moved to trash successfully');
        } catch (\Exception $e) {
            Log::error('Document Delete Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function restore($id)
    {
        try {
            Document::withTrashed()->find($id)->restore();
            return redirect()->back()->with('success', 'Document restored successfully');
        } catch (\Exception $e) {
            Log::error('Document Restore Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function forceDelete($id)
    {
        try {
            Document::withTrashed()->find($id)->forceDelete();
            return redirect()->back()->with('success', 'Document permanently deleted successfully');
        } catch (\Exception $e) {
            Log::error('Document Force Delete Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
