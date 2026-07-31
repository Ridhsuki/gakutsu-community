<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Events\DeleteEventRegistrationQuestionAction;
use App\Actions\Events\GetEventRegistrationQuestionIndexAction;
use App\Actions\Events\StoreEventRegistrationQuestionAction;
use App\Actions\Events\UpdateEventRegistrationQuestionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventRegistrationQuestionIndexRequest;
use App\Http\Requests\Event\StoreEventRegistrationQuestionRequest;
use App\Http\Requests\Event\UpdateEventRegistrationQuestionRequest;
use App\Models\Event;
use App\Models\EventRegistrationQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventRegistrationQuestionController extends Controller
{
    public function index(
        EventRegistrationQuestionIndexRequest $request,
        Event $event,
        GetEventRegistrationQuestionIndexAction $action,
    ): Response {
        $search = $request->validated()['search'] ?? null;

        return Inertia::render('mentor/events/questions/index', [
            'event' => $event->load('mentor:id,name'),
            'questions' => fn () => $action->handle($event, $search),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(
        StoreEventRegistrationQuestionRequest $request,
        Event $event,
        StoreEventRegistrationQuestionAction $action,
    ): RedirectResponse {
        $action->handle($event, $request);

        return redirect()
            ->route('mentor.events.registration-questions.index', $event)
            ->with('success', 'Registration question created successfully.');
    }

    public function update(
        UpdateEventRegistrationQuestionRequest $request,
        Event $event,
        EventRegistrationQuestion $registrationQuestion,
        UpdateEventRegistrationQuestionAction $action,
    ): RedirectResponse {
        abort_unless($registrationQuestion->event_id === $event->id, 404);

        $action->handle($registrationQuestion, $request);

        return redirect()
            ->route('mentor.events.registration-questions.index', $event)
            ->with('success', 'Registration question updated successfully.');
    }

    public function destroy(
        Event $event,
        EventRegistrationQuestion $registrationQuestion,
        DeleteEventRegistrationQuestionAction $action,
    ): RedirectResponse {
        abort_unless($registrationQuestion->event_id === $event->id, 404);
        $this->authorize('manageRegistrationQuestions', $event);

        $action->handle($registrationQuestion);

        return redirect()
            ->route('mentor.events.registration-questions.index', $event)
            ->with('success', 'Registration question deleted successfully.');
    }
}
