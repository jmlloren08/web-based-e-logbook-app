<?php

namespace App\Http\Controllers\Archive;

class OdgController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'ODG';
    }
}
