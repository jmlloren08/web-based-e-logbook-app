<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasUuids, SoftDeletes;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'document_no',
        'title_subject',
        'docs_types',
        'current_state_id',
        'revision_number',
        'is_final',
    ];
    protected $casts = [
        'is_final' => 'boolean',
    ];
    public function currentState()
    {
        return $this->belongsTo(DocumentStates::class, 'current_state_id');
    }
    public function history()
    {
        return $this->hasMany(DocumentHistory::class)
            ->orderBy('timestamp', 'desc');
    }
    public function incomingDocument()
    {
        return $this->hasOne(IncomingDocument::class);
    }
    public function outgoingDocument()
    {
        return $this->hasOne(OutgoingDocument::class);
    }
    public function addHistoryEvent($stateId, $comments = null, $metadata = [], $userId = null)
    {
        // Reset current flag on all previous history events
        $this->history()->update(['is_current' => false]);
        // Create new history event
        return DocumentHistory::create([
            'document_id' => $this->id,
            'document_state_id' => $stateId,
            'user_id' => $userId ?? auth()->user()->id,
            'timestamp' => now(),
            'comments' => $comments,
            'metadata' => $metadata,
            'revision_number' => $this->revision_number,
            'is_current' => true,
        ]);
    }
    // Helper to return document for revision
    public function returnDocumentFor($comment, $metadata = [])
    {
        // Update document state
        $this->current_state_id = 4; // returned
        $this->revision_number += 1;
        $this->save();
        // Add history event
        return $this->addHistoryEvent(
            4, // returned
            $comment,
            $metadata,
        );
    }
    // Helper to send revised document
    public function sendRevised($metadata = [])
    {
        // Update document state
        $this->current_state_id = 2; // sent
        $this->save();
        // Add history event
        return $this->addHistoryEvent(
            2, // sent state
            'Revised document has been sent to recipient.',
            $metadata,
        );
    }
    // Helper to finalize document
    public function finalizeDocument($comments = 'Document has been finalized and completed.', $metadata = [])
    {
        // Update document state
        $this->current_state_id = 6; // finalized
        $this->is_final = true;
        $this->save();
        // Add history event
        return $this->addHistoryEvent(
            6, // finalized state
            $comments,
            $metadata,
        );
    }
}
