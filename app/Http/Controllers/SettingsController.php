<?php

namespace App\Http\Controllers;

use EragLaravelPwa\Core\PWA;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function uploadLogo(Request $request)
    {
        $response = PWA::processLogo($request);
        if ($response['status']) {
            return redirect()->back()->with('success', $response['message']);
        }
        return redirect()->back()->withErrors($response['errors'] ?? ['Something went wrong. Please try again.']);
    }
}
