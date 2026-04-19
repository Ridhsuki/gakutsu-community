<?php

namespace App\Actions\Events;

use App\Models\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetEventIndexAction
{
    public function handle(
        ?string $search = null,
        string $sortField = 'starts_at',
        string $sortDirection = 'desc',
        ?int $mentorId = null,
        ?string $status = null,
        ?string $publication = null,
        ?string $accessType = null,
    ): LengthAwarePaginator {
        $query = Event::query()
            ->select(Event::indexColumns())
            ->with('mentor:id,name')
            ->withCount([
                'registrations',
                'registrationQuestions',
            ]);

        if ($mentorId !== null) {
            $query->ownedByMentor($mentorId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($publication === 'published') {
            $query->where('is_published', true);
        }

        if ($publication === 'draft') {
            $query->where('is_published', false);
        }

        if ($accessType) {
            $query->where('access_type', $accessType);
        }

        return $query
            ->search($search)
            ->applySort($sortField, $sortDirection)
            ->orderBy('id', 'desc')
            ->paginate(9)
            ->withQueryString();
    }
}
