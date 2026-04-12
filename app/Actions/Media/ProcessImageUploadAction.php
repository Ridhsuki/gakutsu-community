<?php

namespace App\Actions\Media;

use App\Enums\MediaImagePreset;
use App\Support\Media\MediaPathGenerator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image;
use InvalidArgumentException;

class ProcessImageUploadAction
{
    public function __construct(
        private readonly MediaPathGenerator $pathGenerator,
    ) {
    }

    public function handle(UploadedFile $file, MediaImagePreset $preset): array
    {
        $config = config("media.presets.{$preset->value}");

        if (!is_array($config)) {
            throw new InvalidArgumentException("Media preset [{$preset->value}] is not configured.");
        }

        $disk = $config['disk'] ?? 'public';
        $mode = $config['mode'] ?? 'scale_down';
        $quality = (int) ($config['quality'] ?? 82);

        $path = $this->pathGenerator->make(
            $config['directory'] ?? 'media/uploads',
            'webp'
        );

        $image = Image::decode($file);

        if ($mode === 'cover') {
            $width = (int) ($config['width'] ?? 0);
            $height = (int) ($config['height'] ?? 0);
            $upsize = (bool) ($config['upsize'] ?? false);

            if ($width < 1 || $height < 1) {
                throw new InvalidArgumentException("Preset [{$preset->value}] requires width and height.");
            }

            if ($upsize) {
                $image->cover($width, $height);
            } else {
                $image->coverDown($width, $height);
            }
        } else {
            $width = (int) ($config['width'] ?? 1600);
            $height = (int) ($config['height'] ?? 1600);

            $image->scaleDown(width: $width, height: $height);
        }

        $encoded = $image->encode(new WebpEncoder(quality: $quality));

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storageDisk */
        $storageDisk = Storage::disk($disk);

        $storageDisk->put($path, (string) $encoded);

        return [
            'disk' => $disk,
            'path' => $path,
            'url' => $storageDisk->url($path),
        ];
    }
}
