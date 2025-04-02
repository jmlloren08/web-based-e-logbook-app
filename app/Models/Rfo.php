<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rfo extends Model
{
    protected $table = 'rfo';
    protected $fillable = [
        'document_no',
        'origin_no',
        'date_time_received_incoming',
        'origin_office',
        'sender',
        'title_subject',
        'doc_type',
        'instruction_action_requested',
        'date_released',
        'forwarded_to_office_name',
        'received_by',
        'date_time_received_outgoing',
        'remarks'
    ];
}
