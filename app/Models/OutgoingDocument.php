<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OutgoingDocument extends Model
{
    use HasUuids;
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'document_id',
        'date_released',
        'forwarded_to_office_department_unit',
        'received_by',
        'date_time_received',
        'remarks',
        'signature_path',
    ];
    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}