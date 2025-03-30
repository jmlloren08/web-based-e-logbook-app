<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class IncomingDocument extends Model
{
    use HasUuids;
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'document_id',
        'other_ref_no',
        'date_time_received',
        'from_office_department_unit',
        'sender_name',
        'instructions_action_requested',
    ];
    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}