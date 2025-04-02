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

            $documents = OutgoingDocument::with(['document'])
                ->whereNotNull('date_released')
                ->whereHas('document')->latest()->paginate(10);
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
            $outgoingDocument = OutgoingDocument::findOrFail($id);
            if (!$outgoingDocument) {
                return redirect()->back()->with('error', 'Document not found');
            }
            // Handle signature upload if provided
            if ($request->hasFile('signature_path')) {
                $signaturePath = $request->file('signature_path')->store('signatures', 'public');
                $validatedData['signature_path'] = $signaturePath;
            }
            // Update outgoing document
            $outgoingDocument->update($validatedData);
            return redirect()->route('outgoing-documents.index')->with('success', 'Document received successfully');
        } catch (\Exception $e) {
            Log::error('Document Log Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            // Log::info('Fetching outgoing document by ID:', ['id' => $id]);
            // Get the outgoing document with related document
            $outgoingDocument = OutgoingDocument::with('document')->findOrFail($id);
            // Get the document
            $document = $outgoingDocument->document;
            // Get the incoming document where document_id matches the current document's id
            $incomingDocument = IncomingDocument::where('document_id', $document->id)->first();
            Log::info('Documents:', [
                'documents' => [
                    'document' => $document,
                    'incomingDocument' => $incomingDocument,
                    'outgoingDocument' => $outgoingDocument,
                ],
            ]);
            // Pass the data to the view
            return Inertia::render('document/outgoing/show', [
                'document' => $document,
                'incomingDocument' => $incomingDocument,
                'outgoingDocument' => $outgoingDocument,
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
