<?php

namespace App\Http\Controllers\Blog;

use App\Actions\Media\ProcessImageUploadAction;
use App\Enums\MediaImagePreset;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogEditorImageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user && ($user->isAdmin() || $user->isMentor()), 403);

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ]);

        $result = app(ProcessImageUploadAction::class)->handle(
            $request->file('image'),
            MediaImagePreset::BlogContent
        );

        return response()->json([
            'url' => $result['url'],
            'path' => $result['path'],
        ]);
    }
}
