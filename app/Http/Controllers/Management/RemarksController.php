<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Remarks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RemarksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $remarks = Remarks::select('id', 'name', 'is_active')
                ->latest('updated_at')
                ->paginate(10);
            return Inertia::render('management/remarks/index', [
                'remarks' => $remarks
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load remarks: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return Inertia::render('management/remarks/create');
        } catch (\Exception $e) {
            Log::error('Failed to load create remark page: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'is_active' => 'boolean'
            ]);

            Remarks::create($validated);
            return redirect()->route('remarks.index')->with('success', 'Remark: ' . $validated['name'] . ' created successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create remark: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $remark = Remarks::findOrFail($id);
            return Inertia::render('management/remarks/show', [
                'remark' => $remark
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to show remark: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $remark = Remarks::findOrFail($id);
            return Inertia::render('management/remarks/edit', [
                'remark' => $remark
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load edit remark page: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'is_active' => 'boolean'
            ]);
            $remark = Remarks::findOrFail($id);
            $remark->update($validated);
            return redirect()->route('remarks.index')->with('success', 'Remark: ' . $validated['name'] . ' updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update remark: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Remarks $remark)
    {
        try {
            $remark->delete();
            return redirect()->route('remarks.index')->with('success', 'Remarks deleted successfully');
        } catch (\Exception $e) {
            Log::error('Failed to delete remark: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
