<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentTypes;
use App\Models\IncomingDocument;
use App\Models\Offices;
use App\Models\OutgoingDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IncomingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Document::with(['currentState', 'incomingDocument'])
                ->whereIn('current_state_id', [1, 4]); // draft and for revision
            // Handle search if search parameter is provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('document_no', 'like', "%{$searchTerm}%")
                        ->orWhere('title_subject', 'like', "%{$searchTerm}%")
                        ->orWhere('docs_types', 'like', "%{$searchTerm}%")
                        ->orWhereHas('incomingDocument', function ($q) use ($searchTerm) {
                            $q->where('other_ref_no', 'like', "%{$searchTerm}%")
                                ->orWhere('from_office_department_unit', 'like', "%{$searchTerm}%")
                                ->orWhere('sender_name', 'like', "%{$searchTerm}%");
                        });
                });
            }
            // Handle tab filtering if tab parameter is provided and not 'all'
            if ($request->has('tab') && $request->tab !== 'all') {
                $tabValue = $request->tab;
                $query->where('document_no', 'like', "%{$tabValue}%");
            }
            $documents = $query->latest('updated_at')->paginate(10);
            return Inertia::render('document/incoming/index', ['documents' => $documents]);
        } catch (\Exception $e) {
            Log::error('Document Index Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function create()
    {
        try {
            $offices = Offices::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            $documentTypes = DocumentTypes::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            return Inertia::render('document/incoming/create', [
                'offices' => $offices,
                'documentTypes' => $documentTypes,
            ]);
        } catch (\Exception $e) {
            Log::error('Document Create Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function edit($id)
    {
        try {
            $document = Document::with('incomingDocument')->findOrFail($id);
            $offices = Offices::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            $documentTypes = DocumentTypes::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            return Inertia::render('document/incoming/edit', [
                'document' => $document,
                'offices' => $offices,
                'documentTypes' => $documentTypes,
            ]);
        } catch (\Exception $e) {
            Log::error('Document Edit Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|in:incoming',
                'document_no' => 'required|unique:documents,document_no',
                'title_subject' => 'required|string',
                'docs_types' => 'required|string',
                // Incoming Document
                'other_ref_no' => 'required_if:type,incoming',
                'date_time_received' => 'required_if:type,incoming',
                'from_office_department_unit' => 'required_if:type,incoming',
                'sender_name' => 'required_if:type,incoming',
                'instructions_action_requested' => 'required_if:type,incoming',
            ]);
            // Save documents
            $document = Document::create([
                'document_no' => $request->document_no,
                'title_subject' => $request->title_subject,
                'docs_types' => $request->docs_types,
                'current_state_id' => 1, // draft
                'revision_number' => 0,
                'is_final' => false,
            ]);
            // Save incoming after document
            if ($request->type === 'incoming') {
                IncomingDocument::create([
                    'document_id' => $document->id,
                    'other_ref_no' => $request->other_ref_no,
                    'date_time_received' => $request->date_time_received,
                    'from_office_department_unit' => $request->from_office_department_unit,
                    'sender_name' => $request->sender_name,
                    'instructions_action_requested' => $request->instructions_action_requested,
                ]);
                // Create history event
                $document->addHistoryEvent(1, 'Document is being drafted.', [
                    'other_ref_no' => $request->other_ref_no,
                    'date_time_received' => $request->date_time_received,
                    'from_office_department_unit' => $request->from_office_department_unit,
                    'sender_name' => $request->sender_name,
                    'instructions_action_requested' => $request->instructions_action_requested,
                ]);
            }
            return redirect()->route('incoming-documents.index')->with('success', 'Created document successfully');
        } catch (\Exception $e) {
            Log::error('Document Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'title_subject' => 'required|string',
                'docs_types' => 'required|string',
                'other_ref_no' => 'nullable|string',
                'date_time_received' => 'required|date',
                'from_office_department_unit' => 'required|string',
                'sender_name' => 'required|string',
                'instructions_action_requested' => 'required|string',
            ]);

            $document = Document::with('incomingDocument', 'outgoingDocument')->findOrFail($id);
            // Update the document
            $document->update([
                'title_subject' => $request->title_subject,
                'docs_types' => $request->docs_types,
            ]);
            // Update the incoming document
            $document->incomingDocument->update([
                'other_ref_no' => $request->other_ref_no ?? null,
                'date_time_received' => $request->date_time_received,
                'from_office_department_unit' => $request->from_office_department_unit,
                'sender_name' => $request->sender_name,
                'instructions_action_requested' => $request->instructions_action_requested,
            ]);
            return redirect()->route('incoming-documents.index')->with('success', 'Updated document successfully');
        } catch (\Exception $e) {
            Log::error('Document Update Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update document: ' . $e->getMessage());
        }
    }

    public function release(Request $request)
    {
        try {

            $request->validate([
                'document_id' => 'required|string',
                'date_released' => 'required|date',
                'forwarded_to_office_department_unit' => 'required|string',
            ]);
            // Find the document
            $document = Document::findOrFail($request->document_id);
            // Create outgoing document record
            OutgoingDocument::create([
                'document_id' => $request->document_id,
                'date_released' => $request->date_released,
                'forwarded_to_office_department_unit' => $request->forwarded_to_office_department_unit,
            ]);
            // Update document state
            $document->current_state_id = 2; // sent
            $document->save();
            // Add history event
            $document->addHistoryEvent(2, 'Document has been sent to recipient.', [
                'date_released' => $request->date_released,
                'forwarded_to_office_department_unit' => $request->forwarded_to_office_department_unit,
            ]);

            return redirect()->back()->with('success', 'Released document successfully');
        } catch (\Exception $e) {
            Log::error('Document Release Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function getOfficesForReleaseDialog()
    {
        try {
            $offices = Offices::select('id', 'name', 'code')
                ->where('is_active', true)
                ->latest('updated_at')
                ->get();
            return response()->json($offices);
        } catch (\Exception $e) {
            Log::error('Error fetching offices: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
    public function destroy(Document $document)
    {
        try {
            $document->delete();
            return redirect()->route('incoming-documents.index')->with('success', 'Document moved to trash successfully');
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
    public function generateDocumentNo(Request $request)
    {
        try {
            $request->validate([
                'from_office_department_unit' => 'required|string',
                'date_received' => 'required|date',
            ]);
            // Log::info('Generating document number for office: ' . $request->from_office_department_unit);
            // Log::info('Date received: ' . $request->date_received);
            $originOffice = $request->from_office_department_unit;
            $dateReceived = $request->has('date_received') ? $request->date_received : now()->format('Y-md');
            $formattedDate = date('Y-md', strtotime($dateReceived));
            // Log::info('Current date: ' . $formattedDate);
            // Get the latest document number for the given origin office and today's date
            $latestDocument = Document::where('document_no', 'like', "%{$originOffice}-{$formattedDate}-%")
                ->latest('document_no')
                ->first();
            // Log::info('Latest document number: ' . ($latestDocument ? $latestDocument->document_no : 'None'));
            // Extract the last four digits and increment
            $lastNumber = $latestDocument ? (int) substr($latestDocument->document_no, -4) : 0;
            // Log::info('Last number extracted: ' . $lastNumber);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT); // Ensure it's 4 digits
            // Log::info('New number generated: ' . $newNumber);
            // Create the new document number
            $newDocumentNo = "{$originOffice}-{$formattedDate}-{$newNumber}";
            // Log::info('New document number: ' . $newDocumentNo);
            return response()->json(['document_no' => $newDocumentNo]);
        } catch (\Exception $e) {
            Log::error('Document No Generation Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
