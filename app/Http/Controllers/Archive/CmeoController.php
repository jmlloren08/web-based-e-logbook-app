<?php

namespace App\Http\Controllers\Archive;

class CmeoController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'CMEO';
    }
}
