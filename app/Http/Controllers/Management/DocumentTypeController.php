<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\DocumentTypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index()
    {
        try {
            $documentTypes = DocumentTypes::select('id', 'name', 'code', 'is_active')
                ->latest('updated_at')
                ->paginate(10);
            return Inertia::render('management/documenttypes/index', [
                'documentTypes' => $documentTypes
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load document types: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function create()
    {
        try {
            return Inertia::render('management/documenttypes/create');
        } catch (\Exception $e) {
            Log::error('Failed to load create document type page: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:document_types',
                'is_active' => 'boolean'
            ]);

            DocumentTypes::create($validated);

            return redirect()->route('document-types.index')->with('success', 'Document type: ' . $validated['name'] . ' created successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $documentType = DocumentTypes::findOrFail($id);
            if (!$documentType) {
                return redirect()->back()->with('error', 'Document type not found');
            }
            return Inertia::render('management/documenttypes/show', [
                'documentType' => $documentType
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to show document type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $documentType = DocumentTypes::findOrFail($id);
            if (!$documentType) {
                return redirect()->back()->with('error', 'Document type not found');
            }
            return Inertia::render('management/documenttypes/edit', [
                'documentType' => $documentType
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to edit document type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:document_types,code,' . $id,
                'is_active' => 'boolean'
            ]);

            $documentType = DocumentTypes::findOrFail($id);
            $documentType->update($validated);
            return redirect()->route('document-types.index')->with('success', 'Updated document type: ' . $validated['name'] . ' successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update document type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(DocumentTypes $documentType)
    {
        try {
            $documentType->delete();
            return redirect()->route('document-types.index')->with('success', 'Deleted document type successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete document type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
