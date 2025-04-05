<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentStates extends Model
{
    use HasFactory;
    protected $table = 'document_states';
    protected $fillable = [
        'name',
        'description',
    ];
    public function documents()
    {
        return $this->hasMany(Document::class, 'current_state_id');
    }
    public function historyEvents()
    {
        return $this->hasMany(DocumentHistory::class, 'document_state_id');
    }
}
