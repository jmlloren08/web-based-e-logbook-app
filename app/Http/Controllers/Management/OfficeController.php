<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Offices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OfficeController extends Controller
{
    public function index()
    {
        try {
            $offices = Offices::select('id', 'name', 'code', 'email', 'is_active')
                ->orderBy('name', 'asc')
                ->paginate(10);
            return Inertia::render('management/offices/index', [
                'offices' => $offices
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load offices: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function create()
    {
        try {
            return Inertia::render('management/offices/create');
        } catch (\Exception $e) {
            Log::error('Failed to load create office page: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50',
                'email' => 'required|string|lowercase|email|max:255|unique:' . Offices::class . '|regex:/^[^@]+@arta\.gov\.ph$/',
                'is_active' => 'boolean'
            ]);

            Offices::create($validated);

            return redirect()->route('offices.index')->with('success', 'Office: ' . $validated['name'] . ' created successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create office: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $office = Offices::findOrFail($id);
            if (!$office) {
                return redirect()->back()->with('error', 'Office not found');
            }
            return Inertia::render('management/offices/show', [
                'office' => $office
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to show office: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $office = Offices::findOrFail($id);
            if (!$office) {
                return redirect()->back()->with('error', 'Office not found');
            }
            return Inertia::render('management/offices/edit', [
                'office' => $office
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to edit office: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => "required|string|max:50|unique:offices,code,{$id}",
                'email' => 'nullable|string|lowercase|email|max:255|unique:' . Offices::class . '|regex:/^[^@]+@arta\.gov\.ph$/',
                'is_active' => 'boolean'
            ]);

            $office = Offices::findOrFail($id);
            $office->update($validated);
            return redirect()->route('offices.index')->with('success', 'Updated office successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update office: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Offices $office)
    {
        try {
            $office->delete();
            return redirect()->route('offices.index')->with('success', 'Deleted office successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete office: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
