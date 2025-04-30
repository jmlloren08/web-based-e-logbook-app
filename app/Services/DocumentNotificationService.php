<?php

namespace App\Services;

use App\Jobs\SendDocumentNotification;
use App\Models\DocumentNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class DocumentNotificationService
{
    protected $rateLimitKey = 'document_notifications';
    protected $maxAttempts = 30; // Maximum number of emails per minute
    protected $decayMinutes = 1; // Rate limit window in minutes

    public function processNotifications()
    {
        $pendingNotifications = DocumentNotification::where('is_sent', false)
            ->orderBy('created_at', 'asc')
            ->get();

        foreach ($pendingNotifications as $notification) {
            if ($this->shouldProcessNotification()) {
                $this->dispatchNotification($notification);
            } else {
                Log::info("Rate limit reached, delaying notification for document {$notification->document_id}");
                // We'll retry in the next run
            }
        }
    }

    protected function shouldProcessNotification(): bool
    {
        return RateLimiter::attempt(
            $this->rateLimitKey,
            $this->maxAttempts,
            function () {
                return true;
            },
            $this->decayMinutes * 60
        );
    }

    protected function dispatchNotification(DocumentNotification $notification)
    {
        try {
            SendDocumentNotification::dispatch($notification)
                ->onQueue('notifications')
                ->delay(now()->addSeconds(rand(0, 30))); // Add random delay to spread out the load

            Log::info("Dispatched notification job for document {$notification->document_id}");
        } catch (\Exception $e) {
            Log::error("Failed to dispatch notification for document {$notification->document_id}: " . $e->getMessage());
        }
    }
}
