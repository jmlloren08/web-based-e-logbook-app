<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use App\Models\DocumentTypes;
use App\Models\User;
use Illuminate\Support\Str;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        DocumentTypes::factory()->createMany([
            [
                'name' => 'Invoice',
                'prefix' => 'INV',
                'description' => 'A document issued for billing customers.',
            ],
            [
                'name' => 'Purchase Order',
                'prefix' => 'PO',
                'description' => 'An official document for purchase authorization.',
            ],
            [
                'name' => 'Delivery Receipt',
                'prefix' => 'DR',
                'description' => 'A receipt confirming goods were delivered.',
            ],
            [
                'name' => 'Sales Report',
                'prefix' => 'SR',
                'description' => 'A summary report of sales transactions.',
            ],
            [
                'name' => 'Contract Agreement',
                'prefix' => 'CA',
                'description' => 'A legal document outlining agreements between parties.',
            ],
            [
                'name' => 'Work Order',
                'prefix' => 'WO',
                'description' => 'A document for job or service requests.',
            ],
            [
                'name' => 'Expense Report',
                'prefix' => 'ER',
                'description' => 'A record of business expenses incurred.',
            ],
            [
                'name' => 'Memorandum',
                'prefix' => 'MEMO',
                'description' => 'An internal communication document.',
            ],
            [
                'name' => 'Leave Application',
                'prefix' => 'LA',
                'description' => 'A document used for requesting leave from work.',
            ],
            [
                'name' => 'Incident Report',
                'prefix' => 'IR',
                'description' => 'A report detailing an incident that occurred.',
            ],
        ]);
    }
}
