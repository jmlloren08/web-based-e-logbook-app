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
    ];
    public function incomingDocument()
    {
        return $this->hasOne(IncomingDocument::class);
    }
    public function outgoingDocument()
    {
        return $this->hasOne(OutgoingDocument::class);
    }
}
