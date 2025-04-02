<?php

namespace App\Http\Controllers\Archive;

class OddgafController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'ODDGAF';
    }
}
