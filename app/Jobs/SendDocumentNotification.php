<?php

namespace App\Jobs;

use App\Models\DocumentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendDocumentNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $maxExceptions = 3;
    public $timeout = 60;
    public $backoff = [60, 120, 300];

    protected $notification;

    public function __construct(DocumentNotification $notification)
    {
        $this->notification = $notification;
    }

    public function handle()
    {
        try {
            $document = $this->notification->document;
            $message = $document->getNotificationMessage($this->notification->days_pending);

            // Send to sender
            if ($this->notification->sender && $this->notification->sender->email) {
                Mail::raw($message, function ($mail) use ($document) {
                    $mail->to($this->notification->sender->email)
                        ->subject("Document Pending Notification: {$document->document_no}");
                });
            }

            // Send to receiver
            if ($this->notification->receiver && $this->notification->receiver->email) {
                Mail::raw($message, function ($mail) use ($document) {
                    $mail->to($this->notification->receiver->email)
                        ->subject("Document Action Required: {$document->document_no}");
                });
            }

            // Mark notification as sent
            $this->notification->update(['is_sent' => true]);

            Log::info("Sent notifications for document {$document->document_no}");
        } catch (\Exception $e) {
            Log::error("Failed to send notification for document {$this->notification->document_id}: " . $e->getMessage());
            throw $e;
        }
    }
} 