<?php

namespace App\Console\Commands;

use App\Models\Document;
use App\Models\DocumentNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckDocumentNotifications extends Command
{
    protected $signature = 'documents:check-notifications';
    protected $description = 'Check for documents requiring notifications based on pending time';

    private $notificationDays = [3, 7, 20];

    public function handle()
    {
        $this->info('Checking for documents requiring notifications...');
        // Log::info('Checking for documents requiring notifications...');
        try {
            // Get all documents in received state (state_id = 3)
            $documents = Document::where('current_state_id', 3)
                ->with(['outgoingDocument', 'incomingDocument'])
                ->get();

            foreach ($documents as $document) {
                $this->checkDocumentNotifications($document);
            }

            $this->info('Document notification check completed successfully.');
        } catch (\Exception $e) {
            Log::error('Document notification check error: ' . $e->getMessage());
            $this->error('Error checking document notifications: ' . $e->getMessage());
        }
    }

    private function checkDocumentNotifications($document)
    {
        // Get the date the document was received
        $receivedDate = optional($document->outgoingDocument)->date_time_received;
        if (!$receivedDate) return;

        $daysPending = Carbon::parse($receivedDate)->diffInDays(now());

        foreach ($this->notificationDays as $threshold) {
            if ($daysPending >= $threshold) {
                $this->createNotificationIfNeeded($document, $threshold);
            }
        }
    }

    private function createNotificationIfNeeded($document, $days)
    {
        // Check if notification already exists for this threshold
        $exists = DocumentNotification::where('document_id', $document->id)
            ->where('days_pending', $days)
            ->exists();

        if (!$exists) {
            // Create notification record
            DocumentNotification::create([
                'document_id' => $document->id,
                'sender_id' => '0195eaa5-5a81-7240-be57-8a63ba05f226',
                'receiver_id' => '019608e3-d0dd-711c-85dd-851b0e9c8869',
                'days_pending' => $days,
                'notification_date' => now(),
                'last_state_change' => $document->updated_at,
            ]);

            Log::info("Created notification for document {$document->document_no} pending for {$days} days");
        }
    }
}