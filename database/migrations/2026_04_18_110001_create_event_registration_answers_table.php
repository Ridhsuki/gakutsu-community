<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registration_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_registration_id')
                ->constrained('event_registrations')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->unsignedBigInteger('event_registration_question_id')->nullable();

            $table->string('question_label_snapshot');
            $table->string('question_type_snapshot', 30);
            $table->longText('answer_value')->nullable();

            $table->timestamps();

            $table->foreign(
                'event_registration_question_id',
                'era_question_fk'
            )
                ->references('id')
                ->on('event_registration_questions')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->unique(
                ['event_registration_id', 'event_registration_question_id'],
                'era_registration_question_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registration_answers');
    }
};
