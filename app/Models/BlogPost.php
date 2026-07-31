<?php

namespace App\Models;

use App\Enums\BlogPostStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = ['cover_image_url'];

    protected function casts(): array
    {
        return [
            'status' => BlogPostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    protected function coverImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->cover_image_path
            ? Storage::disk('public')->url($this->cover_image_path)
            : null,
        );
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
            'content',
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
                ->orWhere('slug', 'like', "%{$search}%")
                ->orWhereHas('author', function (Builder $authorQuery) use ($search) {
                    $authorQuery->where('name', 'like', "%{$search}%");
                });
        });
    }

    #[Scope]
    protected function applySort(Builder $query, string $field, string $direction): void
    {
        $allowed = ['title', 'status', 'published_at', 'created_at', 'author'];

        if (! in_array($field, $allowed, true)) {
            $field = 'created_at';
        }

        $direction = $direction === 'asc' ? 'asc' : 'desc';

        if ($field === 'author') {
            $query->orderBy(
                User::select('name')
                    ->whereColumn('users.id', 'blog_posts.author_id'),
                $direction
            );

            return;
        }

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
