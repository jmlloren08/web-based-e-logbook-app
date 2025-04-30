<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Offices extends Model
{
    use HasUuids;
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'name',
        'code',
        'email',
        'is_active'
    ];
    protected $casts = [
        'is_active' => 'boolean'
    ];
    // public function recipients()
    // {
    //     return $this->hasMany(Recipients::class);
    // }
}
