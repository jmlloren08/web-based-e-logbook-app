<?php

use App\Http\Controllers\Archive\AdminController;
use App\Http\Controllers\Archive\BroController;
use App\Http\Controllers\Archive\CmeoController;
use App\Http\Controllers\Archive\FinanceController;
use App\Http\Controllers\Archive\OddgafController;
use App\Http\Controllers\Archive\OddglController;
use App\Http\Controllers\Archive\OddgoController;
use App\Http\Controllers\Archive\OdgController;
use App\Http\Controllers\Archive\RfoController;
use App\Http\Controllers\Document\DashboardController;
use App\Http\Controllers\Document\DocumentController;
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
    // Document
    Route::resource('/auth/verified/document', DocumentController::class);
    Route::post('/auth/verified/document/{id}/return-document-for', [DocumentController::class, 'returnDocumentFor'])->name('document.return-document-for');
    Route::post('/auth/verified/document/{id}/finalize-document', [DocumentController::class, 'finalizeDocument'])->name('document.finalize-document');
    Route::post('/auth/verified/document/{id}/submit-revision', [DocumentController::class, 'submitRevision'])->name('document.submit-revision');
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
    // Archive Routes
    Route::prefix('document/archive')->name('document.archive.')->group(function () {
        Route::get('/odg', [OdgController::class, 'index'])->name('odg.index');
        Route::get('/oddgo', [OddgoController::class, 'index'])->name('oddgo.index');
        Route::get('/Oddgl', [OddglController::class, 'index'])->name('oddgl.index');
        Route::get('/oddgaf', [OddgafController::class, 'index'])->name('oddgaf.index');
        Route::get('/bro', [BroController::class, 'index'])->name('bro.index');
        Route::get('/cmeo', [CmeoController::class, 'index'])->name('cmeo.index');
        Route::get('/rfo', [RfoController::class, 'index'])->name('rfo.index');
        Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
        Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
    });
    // Admin-only routes
    Route::middleware(['admin'])->group(function () {
        // Route::resource('users', UserController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
