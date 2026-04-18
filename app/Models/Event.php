<?php

namespace App\Models;

use App\Enums\EventAccessType;
use App\Enums\EventStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'created_by',
    'mentor_id',
    'title',
    'slug',
    'category',
    'status',
    'access_type',
    'is_published',
    'is_registration_open',
    'registration_closes_at',
    'meeting_provider',
    'meeting_url',
    'poster_image_path',
    'starts_at',
    'ends_at',
    'description',
])]
class Event extends Model
{
    protected $appends = ['poster_image_url'];

    protected function casts(): array
    {
        return [
            'status' => EventStatus::class,
            'access_type' => EventAccessType::class,
            'is_published' => 'boolean',
            'is_registration_open' => 'boolean',
            'registration_closes_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    protected function posterImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn(): ?string => $this->poster_image_path
            ? Storage::url('public/' . $this->poster_image_path)
            : null,
        );
    }

    public static function indexColumns(): array
    {
        return [
            'id',
            'created_by',
            'mentor_id',
            'title',
            'slug',
            'category',
            'status',
            'access_type',
            'is_published',
            'is_registration_open',
            'registration_closes_at',
            'meeting_provider',
            'meeting_url',
            'poster_image_path',
            'starts_at',
            'ends_at',
            'created_at',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function registrationQuestions(): HasMany
    {
        return $this->hasMany(EventRegistrationQuestion::class);
    }

    #[Scope]
    protected function search(Builder $query, ?string $search): void
    {
        $search = trim((string) $search);

        if ($search === '') {
            return;
        }

        $query->where(function (Builder $q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%")
                ->orWhereHas('mentor', function (Builder $mentorQuery) use ($search) {
                    $mentorQuery->where('name', 'like', "%{$search}%");
                });
        });
    }

    #[Scope]
    protected function applySort(Builder $query, string $field, string $direction): void
    {
        $allowed = ['title', 'category', 'status', 'starts_at', 'created_at', 'mentor'];

        if (!in_array($field, $allowed, true)) {
            $field = 'starts_at';
        }

        $direction = $direction === 'asc' ? 'asc' : 'desc';

        if ($field === 'mentor') {
            $query->orderBy(
                User::select('name')->whereColumn('users.id', 'events.mentor_id'),
                $direction,
            );

            return;
        }

        $query->orderBy($field, $direction);
    }

    #[Scope]
    protected function ownedByMentor(Builder $query, int $userId): void
    {
        $query->where('mentor_id', $userId);
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    public function registrationIsAvailable(): bool
    {
        if (!$this->is_published) {
            return false;
        }

        if ($this->status !== EventStatus::Upcoming) {
            return false;
        }

        if (!$this->is_registration_open) {
            return false;
        }

        if ($this->registration_closes_at && now()->greaterThan($this->registration_closes_at)) {
            return false;
        }

        return true;
    }
}
