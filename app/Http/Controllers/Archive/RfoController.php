<?php

namespace App\Http\Controllers\Archive;

class RfoController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'RFO';
    }
}
