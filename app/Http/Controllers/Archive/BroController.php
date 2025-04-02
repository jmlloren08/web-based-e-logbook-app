<?php

namespace App\Http\Controllers\Archive;

class BroController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'BRO';
    }
}
