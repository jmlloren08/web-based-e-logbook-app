<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\IncomingDocument;
use App\Models\OutgoingDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OutgoingController extends Controller
{
    public function index()
    {
        try {
            $documents = Document::with(['currentState', 'outgoingDocument'])
                ->whereIn('current_state_id', [2, 3, 6]) // sent, received, finalized
                // ->where('is_final', false)
                ->latest()
                ->paginate(10);
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
            if (!$outgoingDocument) {
                return redirect()->back()->with('error', 'Document not found');
            }
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
            if (!$document) {
                return redirect()->back()->with('error', 'Document not found');
            }
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
            return redirect()->route('outgoing-documents.index')->with('success', 'Received document successfully');
        } catch (\Exception $e) {
            Log::error('Document Log Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
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
