<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\EventQuiz\UpsertEventQuizQuestionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\EventQuiz\StoreEventQuizQuestionRequest;
use App\Http\Requests\EventQuiz\UpdateEventQuizQuestionRequest;
use App\Models\Event;
use App\Models\EventQuizQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventQuizQuestionController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorize('viewAny', [EventQuizQuestion::class, $event]);

        return Inertia::render('mentor/events/quiz-questions/index', [
            'event' => $event->load('mentor:id,name'),
            'questions' => $event->quizQuestions()
                ->with('options')
                ->ordered()
                ->get(),
        ]);
    }

    public function store(
        Event $event,
        StoreEventQuizQuestionRequest $request,
        UpsertEventQuizQuestionAction $action,
    ): RedirectResponse {
        $this->authorize('create', [EventQuizQuestion::class, $event]);

        $action->handle($event, $request->validated());

        return redirect()
            ->route('mentor.events.quiz-questions.index', $event)
            ->with('success', 'Quiz question created successfully.');
    }

    public function update(
        Event $event,
        EventQuizQuestion $question,
        UpdateEventQuizQuestionRequest $request,
        UpsertEventQuizQuestionAction $action,
    ): RedirectResponse {
        abort_unless($question->event_id === $event->id, 404);

        $this->authorize('update', $question);

        $action->handle($event, $request->validated(), $question);

        return redirect()
            ->route('mentor.events.quiz-questions.index', $event)
            ->with('success', 'Quiz question updated successfully.');
    }

    public function destroy(Event $event, EventQuizQuestion $question): RedirectResponse
    {
        abort_unless($question->event_id === $event->id, 404);

        $this->authorize('delete', $question);

        $question->delete();

        return redirect()
            ->route('mentor.events.quiz-questions.index', $event)
            ->with('success', 'Quiz question deleted successfully.');
    }
}
