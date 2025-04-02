<?php

use App\Http\Controllers\Archive\RfoController;
use App\Http\Controllers\Document\ArchiveController;
use App\Http\Controllers\Document\DashboardController;
use App\Http\Controllers\Document\IncomingController;
use App\Http\Controllers\Document\OutgoingController;
use App\Http\Controllers\OfflineController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/offline', [OfflineController::class, 'index'])->name('offline');
    // Dashboard
    Route::get('/auth/verified/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Incoming Documents
    Route::resource('auth/verified/incoming-documents', IncomingController::class)->except('destroy');
    Route::delete('auth/verified/incoming-documents/{document}', [IncomingController::class, 'destroy'])->name('incoming-documents.destroy');
    Route::post('auth/verified/incoming-documents/{id}/restore', [IncomingController::class, 'restore'])->name('incoming-documents.restore');
    Route::delete('auth/verified/incoming-documents/{id}/force-delete', [IncomingController::class, 'forceDelete'])->name('incoming-documents.force-delete');
    Route::post('auth/verified/incoming-documents/release', [IncomingController::class, 'release'])->name('incoming-documents.release');
    // Outgoing Documents
    Route::put('auth/verified/outgoing-documents/{id}/modify', [OutgoingController::class, 'modify'])->name('outgoing-documents.modify');
    Route::resource('auth/verified/outgoing-documents', OutgoingController::class)->except(['destroy', 'update']);
    Route::patch('auth/verified/outgoing-documents/{id}', [OutgoingController::class, 'update'])->name('outgoing-documents.update');
    Route::delete('auth/verified/outgoing-documents/{document}', [OutgoingController::class, 'destroy'])->name('outgoing-documents.destroy');
    Route::post('auth/verified/outgoing-documents/{id}/restore', [OutgoingController::class, 'restore'])->name('outgoing-documents.restore');
    Route::delete('auth/verified/outgoing-documents/{id}/force-delete', [OutgoingController::class, 'forceDelete'])->name('outgoing-documents.force-delete');
    // Archives / RFO
    Route::resource('auth/verified/rfos', RfoController::class);
    // Admin-only routes
    Route::middleware(['admin'])->group(function () {
        // Route::resource('users', UserController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
