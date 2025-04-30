<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestSchedulerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-scheduler';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if scheduler is working';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('✅ TestSchedulerCommand ran successfully at ' . now());
        $this->info('✅ TestSchedulerCommand ran successfully.');
    }
}
