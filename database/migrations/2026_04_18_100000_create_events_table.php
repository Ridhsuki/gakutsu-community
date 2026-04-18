<?php

use App\Enums\EventAccessType;
use App\Enums\EventStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('mentor_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->string('category', 100)->index();
            $table->string('status', 20)->default(EventStatus::Upcoming->value)->index();
            $table->string('access_type', 10)->default(EventAccessType::Free->value)->index();

            $table->boolean('is_published')->default(false)->index();

            $table->dateTime('registration_closes_at')->nullable()->index();

            $table->string('meeting_provider', 50)->nullable();
            $table->string('meeting_url')->nullable();

            $table->string('poster_image_path')->nullable();

            $table->dateTime('starts_at')->index();
            $table->dateTime('ends_at')->nullable();

            $table->longText('description');

            $table->timestamps();

            $table->index(['mentor_id', 'status']);
            $table->index(['is_published', 'status', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
