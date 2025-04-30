<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocumentNotification extends Model
{
    use HasUuids;

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'document_id',
        'sender_id',
        'receiver_id',
        'days_pending',
        'is_sent',
        'notification_date',
        'last_state_change',
    ];

    protected $casts = [
        'is_sent' => 'boolean',
        'notification_date' => 'datetime',
        'last_state_change' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}