<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Recipients extends Model
{
    use HasUuids;
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'name',
        'code',
        'is_active',
        'office_id'
    ];
    protected $casts = [
        'is_active' => 'boolean'
    ];
    public function offices()
    {
        return $this->belongsTo(Offices::class, 'office_id');
    }
}
