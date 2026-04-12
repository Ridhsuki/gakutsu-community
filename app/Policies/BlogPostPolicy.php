<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;

class BlogPostPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isMentor();
    }

    public function view(User $user, BlogPost $blogPost): bool
    {
        return $user->isMentor() && $blogPost->author_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isMentor();
    }

    public function update(User $user, BlogPost $blogPost): bool
    {
        return $user->isMentor() && $blogPost->author_id === $user->id;
    }

    public function delete(User $user, BlogPost $blogPost): bool
    {
        return $user->isMentor() && $blogPost->author_id === $user->id;
    }
}
