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
        Schema::create('event_quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_quiz_attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_quiz_question_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('event_quiz_option_id')->nullable()->constrained()->nullOnDelete();

            $table->text('question_prompt_snapshot');
            $table->string('question_type_snapshot', 32);
            $table->unsignedSmallInteger('question_points_snapshot');
            $table->string('option_text_snapshot')->nullable();

            $table->longText('answer_text')->nullable();
            $table->boolean('needs_manual_grading')->default(false);
            $table->boolean('is_correct')->nullable();
            $table->unsignedSmallInteger('awarded_score')->default(0);
            $table->text('feedback')->nullable();

            $table->foreignId('graded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(
                ['event_quiz_attempt_id', 'event_quiz_question_id'],
                'event_quiz_attempt_question_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_quiz_answers');
    }
};
