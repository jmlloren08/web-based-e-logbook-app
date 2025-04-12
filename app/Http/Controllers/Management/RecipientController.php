<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Recipients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RecipientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $recipients = Recipients::select('id', 'name', 'code', 'is_active')
                ->latest('updated_at')
                ->paginate(10);
            return Inertia::render('management/recipients/index', [
                'recipients' => $recipients
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load recipients: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return Inertia::render('management/recipients/create');
        } catch (\Exception $e) {
            Log::error('Failed to load create recipient page: ' . $e->getMessage());
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
                'code' => 'required|string|max:50|unique:recipients',
                'is_active' => 'boolean'
            ]);

            Recipients::create($validated);

            return redirect()->route('recipients.index')->with('success', 'Recipient: ' . $validated['name'] . ' created successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create recipient: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $recipient = Recipients::findOrFail($id);
            if (!$recipient) {
                return redirect()->back()->with('error', 'Recipient not found');
            }
            return Inertia::render('management/recipients/show', [
                'recipient' => $recipient
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to show recipient: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $recipient = Recipients::findOrFail($id);
            if (!$recipient) {
                return redirect()->back()->with('error', 'Recipient not found');
            }
            return Inertia::render('management/recipients/edit', [
                'recipient' => $recipient
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to edit recipient: ' . $e->getMessage());
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
                'code' => 'required|string|max:50|unique:recipients,code,' . $id,
                'is_active' => 'boolean'
            ]);

            $recipient = Recipients::findOrFail($id);
            $recipient->update($validated);
            return redirect()->route('recipients.index')->with('success', 'Updated recipient :' . $validated['name'] . ' successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update recipient: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipients $recipient)
    {
        try {
            $recipient->delete();
            return redirect()->route('recipients.index')->with('success', 'Deleted recipient successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete recipient: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
