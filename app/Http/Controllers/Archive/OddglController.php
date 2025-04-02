<?php

namespace App\Http\Controllers\Archive;

class OddglController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'ODDGL';
    }
}
