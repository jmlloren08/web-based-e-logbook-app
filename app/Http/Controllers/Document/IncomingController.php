<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\IncomingDocument;
use App\Models\OutgoingDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IncomingController extends Controller
{
    public function index()
    {
        try {
            $documents = Document::with(['incomingDocument'])
                ->whereDoesntHave('outgoingDocument', function ($query) {
                    $query->whereNotNull('date_released');
                })
                ->latest()
                ->paginate(10);
            return Inertia::render('document/incoming/index', ['documents' => $documents]);
        } catch (\Exception $e) {
            Log::error('Document Index Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function create()
    {
        try {
            return Inertia::render('document/incoming/create');
        } catch (\Exception $e) {
            Log::error('Document Create Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function edit($id)
    {
        try {
            $document = IncomingDocument::with('document')->findOrFail($id);
            Log::info('Documents:', ['documents' => $document]);
            return Inertia::render('document/incoming/edit', ['document' => $document]);
        } catch (\Exception $e) {
            Log::error('Document Edit Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'document_no' => 'required|unique:documents,document_no,' . $id,
                'title_subject' => 'required|string',
                'docs_types' => 'required|string',
                'other_ref_no' => 'required',
                'date_time_received' => 'required',
                'from_office_department_unit' => 'required',
                'sender_name' => 'required',
                'instructions_action_requested' => 'required',
            ]);

            $incomingDocument = IncomingDocument::with('document')->findOrFail($id);
            $incomingDocument->document->update([
                'document_no' => $request->document_no,
                'title_subject' => $request->title_subject,
                'docs_types' => $request->docs_types,
            ]);
            $incomingDocument->update([
                'other_ref_no' => $request->other_ref_no,
                'date_time_received' => $request->date_time_received,
                'from_office_department_unit' => $request->from_office_department_unit,
                'sender_name' => $request->sender_name,
                'instructions_action_requested' => $request->instructions_action_requested,
            ]);
            return redirect()->route('incoming-documents.index')->with('success', 'Document updated successfully');
        } catch (\Exception $e) {
            Log::error('Document Update Error: ' . $e->getMessage());
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
            }
            return redirect()->route('incoming-documents.index')->with('success', 'Document created successfully');
        } catch (\Exception $e) {
            Log::error('Document Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function release(Request $request)
    {
        try {

            $request->validate([
                'type' => 'required|in:outgoing',
                'document_id' => 'required|string',
                'date_released' => 'required_if:type,outgoing',
                'forwarded_to_office_department_unit' => 'required_if:type,outgoing',
            ]);

            if ($request->type === 'outgoing') {
                OutgoingDocument::create([
                    'document_id' => $request->document_id,
                    'date_released' => $request->date_released,
                    'forwarded_to_office_department_unit' => $request->forwarded_to_office_department_unit,
                ]);
            }
            return redirect()->back()->with('success', 'Document released successfully');
        } catch (\Exception $e) {
            Log::error('Document Release Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
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
}
