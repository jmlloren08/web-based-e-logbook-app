<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archive', function (Blueprint $table) {
            $table->id();
            $table->string('document_no')->unique();
            $table->string('origin_no')->nullable();
            $table->string('date_ticolumn: me_received_incoming')->nullable();
            $table->string('origin_office')->nullable();
            $table->string('sender')->nullable();
            $table->text('title_subject')->nullable();
            $table->string('doc_type')->nullable();
            $table->text('instruction_action_requested')->nullable();
            $table->string('date_released')->nullable();
            $table->string('forwarded_to_office_name')->nullable();
            $table->string('received_by')->nullable();
            $table->string('date_time_received_outgoing')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archive');
    }
};
