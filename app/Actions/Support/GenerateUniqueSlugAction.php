<?php

namespace App\Actions\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GenerateUniqueSlugAction
{
    /**
     * @param  class-string<Model>  $modelClass
     */
    public function handle(string $title, string $modelClass, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);

        if ($baseSlug === '') {
            $baseSlug = 'event';
        }

        $slug = $baseSlug;

        while ($modelClass::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = "{$baseSlug}-".Str::lower(Str::random(4));
        }

        return $slug;
    }
}
