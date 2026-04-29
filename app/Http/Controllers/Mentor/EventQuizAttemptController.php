<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\EventQuiz\GradeEventQuizAttemptAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\EventQuiz\GradeEventQuizAnswerRequest;
use App\Models\Event;
use App\Models\EventQuizAnswer;
use App\Models\EventQuizAttempt;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EventQuizAttemptController extends Controller
{
    public function index(Event $event, Request $request): Response
    {
        $this->authorize('viewAny', [EventQuizAttempt::class, $event]);

        $search = trim((string) $request->string('search'));
        $status = trim((string) $request->string('status'));

        $attempts = $event->quizAttempts()
            ->with('user:id,name,email')
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(in_array($status, ['submitted', 'graded'], true), function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('submitted_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('mentor/events/quiz-attempts/index', [
            'event' => $event->load('mentor:id,name'),
            'attempts' => $attempts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function show(Event $event, EventQuizAttempt $attempt): Response
    {
        abort_unless($attempt->event_id === $event->id, 404);

        $this->authorize('view', $attempt);

        return Inertia::render('mentor/events/quiz-attempts/show', [
            'event' => $event->load('mentor:id,name'),
            'attempt' => $attempt->load([
                'user:id,name,email',
                'answers.grader:id,name',
            ]),
        ]);
    }

    public function grade(
        Event $event,
        EventQuizAttempt $attempt,
        EventQuizAnswer $answer,
        GradeEventQuizAnswerRequest $request,
        GradeEventQuizAttemptAction $action,
    ): RedirectResponse {
        abort_unless($attempt->event_id === $event->id, 404);
        abort_unless($answer->event_quiz_attempt_id === $attempt->id, 404);

        $this->authorize('grade', $attempt);

        $validated = $request->validated();

        $action->handle(
            $answer,
            $request->user()->id,
            (int) $validated['awarded_score'],
            $validated['feedback'] ?? null,
        );

        return redirect()
            ->route('mentor.events.quiz-attempts.show', [$event, $attempt])
            ->with('success', 'Answer graded successfully.');
    }
}
