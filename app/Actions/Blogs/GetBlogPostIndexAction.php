<?php

namespace App\Actions\Blogs;

use App\Models\BlogPost;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetBlogPostIndexAction
{
    public function handle(
        ?string $search = null,
        string $sortField = 'created_at',
        string $sortDirection = 'desc',
        ?int $authorId = null,
    ): LengthAwarePaginator {
        $query = BlogPost::query()
            ->select(BlogPost::indexColumns())
            ->with('author:id,name');

        if ($authorId !== null) {
            $query->ownedBy($authorId);
        }

        return $query
            ->search($search)
            ->applySort($sortField, $sortDirection)
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();
    }
}
