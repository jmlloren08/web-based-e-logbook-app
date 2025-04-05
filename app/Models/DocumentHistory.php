<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocumentHistory extends Model
{
    use HasUuids;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'uuid';
    protected $table = 'document_history';
    protected $casts = [
        'metadata' => 'array',
        'timestamp' => 'datetime',
        'is_current' => 'boolean',
    ];
    protected $fillable = [
        'document_id',
        'document_state_id',
        'user_id',
        'timestamp',
        'comments',
        'metadata',
        'revision_number',
        'is_current',
    ];
    public function document()
    {
        return $this->belongsTo(Document::class);
    }
    public function state()
    {
        return $this->belongsTo(DocumentStates::class, 'document_state_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
