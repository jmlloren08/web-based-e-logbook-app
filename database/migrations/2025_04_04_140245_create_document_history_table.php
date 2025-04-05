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
        Schema::create('document_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('document_state_id')->constrained('document_states')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('timestamp')->useCurrent();
            $table->text('comments')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->integer('revision_number')->default(0);
            $table->boolean('is_current')->default(true);
            $table->timestamps();
        });
        // Add index for faster lookups
        Schema::table('document_history', function (Blueprint $table) {
            $table->index(['document_id', 'timestamp']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_history');
    }
};
