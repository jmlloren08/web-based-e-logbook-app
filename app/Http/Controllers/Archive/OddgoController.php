<?php

namespace App\Http\Controllers\Archive;

class OddgoController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'ODDGO';
    }
}
