<?php

use App\Enums\EventRegistrationQuestionType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registration_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('label');
            $table->string('type', 30)->default(EventRegistrationQuestionType::ShortText->value);
            $table->json('options')->nullable();
            $table->string('placeholder')->nullable();
            $table->text('help_text')->nullable();

            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(1);

            $table->timestamps();

            $table->index(['event_id', 'is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registration_questions');
    }
};
