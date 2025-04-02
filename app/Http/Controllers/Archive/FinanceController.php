<?php

namespace App\Http\Controllers\Archive;

class FinanceController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'FINANCE';
    }
}
