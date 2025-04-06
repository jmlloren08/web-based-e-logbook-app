<?php

namespace App\Console\Commands;

use App\Models\Document;
use App\Models\IncomingDocument;
use App\Models\OutgoingDocument;
use Illuminate\Console\Command;

class MigrateDocumentData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'documents:document-data';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrates existing document data to the new document history structure';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of document data...');
        $bar = $this->output->createProgressBar(Document::count());

        Document::chunk(100, function ($documents) use ($bar) {
            foreach ($documents as $document) {
                // Get corresponding records
                $incoming = IncomingDocument::where('document_id', $document->id)->first();
                $outgoing = OutgoingDocument::where('document_id', $document->id)->first();
                // Default state to draft
                $currentStateId = 1;
                // Create history for incoming documents
                if ($incoming) {
                    $document->history()->create([
                        'document_state_id' => $currentStateId,
                        'user_id' => '019608e3-d0dd-711c-85dd-851b0e9c8869', // System user for draft state
                        'timestamp' => $incoming->date_time_received,
                        'comments' => 'Document is being drafted.',
                        'metadata' => [
                            'other_ref_no' => $incoming->other_ref_no,
                            'from_office' => $incoming->from_office_department_unit,
                            'sender_name' => $incoming->sender_name,
                            'instructions' => $incoming->instructions_action_requested,
                        ],
                        'revision_number' => $document->revision_number,
                        'is_current' => !$outgoing,
                    ]);
                }
                // Create history for outgoing documents
                if ($outgoing && $outgoing->date_released) {
                    $currentStateId = 2; // Sent
                    $document->history()->create([
                        'document_state_id' => $currentStateId,
                        'user_id' => '019608e3-d0dd-711c-85dd-851b0e9c8869', // System user for sent state
                        'timestamp' => $outgoing->date_released,
                        'comments' => 'Document has been sent to recipient.',
                        'metadata' => [
                            'date_released' => $outgoing->date_released,
                            'forwarded_to' => $outgoing->forwarded_to_office_department_unit,
                        ],
                        'revision_number' => $document->revision_number,
                        'is_current' => !$incoming,
                    ]);
                }
                // Create history for outgoing documents if received by recipient
                if ($outgoing && $outgoing->date_time_received) {
                    $currentStateId = 3; // Received
                    $document->history()->create([
                        'document_state_id' => $currentStateId,
                        'user_id' => '019608e3-d0dd-711c-85dd-851b0e9c8869', // System user for received state
                        'timestamp' => $outgoing->date_time_received,
                        'comments' => 'Document has been received by recipient.',
                        'metadata' => [
                            'received_by' => $outgoing->received_by,
                            'date_time_received' => $outgoing->date_time_received,
                            'remarks' => $outgoing->remarks,
                            'signature_path' => $outgoing->signature_path,
                        ],
                        'revision_number' => $document->revision_number,
                        'is_current' => true,
                    ]);
                }
                $document->current_state_id = $currentStateId;
                $document->save();
                $bar->advance();
            }
        });
        $bar->finish();
        $this->newLine();
        $this->info('Document data migration completed successfully.');
    }
}