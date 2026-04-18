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
    ): LengthAwarePaginator {
        $query = Event::query()
            ->select(Event::indexColumns())
            ->with('mentor:id,name');

        if ($mentorId !== null) {
            $query->ownedByMentor($mentorId);
        }

        return $query
            ->search($search)
            ->applySort($sortField, $sortDirection)
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();
    }
}
