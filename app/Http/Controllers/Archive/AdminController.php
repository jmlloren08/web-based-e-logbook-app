<?php

namespace App\Http\Controllers\Archive;

class AdminController extends BaseArchiveController
{
    protected function initializeOffice()
    {
        $this->officeName = 'ADMIN';
    }
}
