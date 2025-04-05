<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use App\Models\DocumentTypes;
use App\Models\User;
use Database\Factories\DocumentStatesFactory;
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

        DocumentStatesFactory::new()->create([
            'name' => 'Draft',
            'description' => 'Document is being drafted.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Sent',
            'description' => 'Document has been sent to recipient.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Received',
            'description' => 'Document has been received by recipient.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Returned',
            'description' => 'Document has been returned for revision.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Revised',
            'description' => 'Document has been revised.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Finalized',
            'description' => 'Document has been finalized and completed.',
        ]);
        DocumentStatesFactory::new()->create([
            'name' => 'Archived',
            'description' => 'Document has been archived.',
        ]);
    }
}
