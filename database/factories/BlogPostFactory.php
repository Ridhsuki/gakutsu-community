<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(mt_rand(5, 10));
        $status = $this->faker->randomElement(['published', 'draft']);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'status' => $status,
            'cover_image_path' => $this->faker->boolean(70) ? $this->faker->imageUrl(800, 600, 'blog', true) : null,
            'content' => $this->faker->paragraphs(6, true),
            'published_at' => $status === 'published' ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
