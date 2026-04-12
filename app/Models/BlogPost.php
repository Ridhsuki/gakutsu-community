<?php

namespace App\Models;

use App\Enums\BlogPostStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'author_id',
    'title',
    'slug',
    'status',
    'cover_image_path',
    'content',
    'published_at',
])]
class BlogPost extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => BlogPostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public static function indexColumns(): array
    {
        return [
            'id',
            'author_id',
            'title',
            'slug',
            'status',
            'cover_image_path',
            'published_at',
            'created_at',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
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
                ->orWhere('slug', 'like', "%{$search}%");
        });
    }

    #[Scope]
    protected function applySort(Builder $query, string $field, string $direction): void
    {
        $allowed = ['title', 'status', 'published_at', 'created_at'];

        if (!in_array($field, $allowed, true)) {
            $field = 'created_at';
        }

        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query->orderBy($field, $direction);
    }

    #[Scope]
    protected function ownedBy(Builder $query, int $userId): void
    {
        $query->where('author_id', $userId);
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', BlogPostStatus::Published->value);
    }

    public function isDraft(): bool
    {
        return $this->status === BlogPostStatus::Draft;
    }

    public function isPublished(): bool
    {
        return $this->status === BlogPostStatus::Published;
    }
}
