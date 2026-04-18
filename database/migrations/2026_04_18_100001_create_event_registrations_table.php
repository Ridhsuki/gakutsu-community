<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('name_snapshot');
            $table->string('email_snapshot');

            $table->dateTime('registered_at')->index();

            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            $table->index(['user_id', 'registered_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
