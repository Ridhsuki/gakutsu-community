<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogPost>
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

        $htmlContent = '<h2>'.$this->faker->sentence(4).'</h2>';
        $htmlContent .= '<p>'.$this->faker->paragraph(3).'</p>';
        $htmlContent .= '<blockquote style="border-left: 5px solid #3b82f6; padding-left: 15px; margin: 20px 0; background: #f9fafb; padding: 15px;">';
        $htmlContent .= '<strong>Info Factory:</strong> Konten blog ini berhasil di-generate dan masuk ke database menggunakan <code>BlogPostFactory</code>. Anda dapat mengedit atau menghapusnya kapan saja melalui editor WYSIWYG.';
        $htmlContent .= '</blockquote>';

        $paragraphs = $this->faker->paragraphs(3);
        foreach ($paragraphs as $paragraph) {
            $htmlContent .= '<p>'.$paragraph.'</p>';
        }

        $htmlContent .= '<h3>Poin Penting:</h3>';
        $htmlContent .= '<ul>';
        $htmlContent .= '<li>'.$this->faker->sentence().'</li>';
        $htmlContent .= '<li>'.$this->faker->sentence().'</li>';
        $htmlContent .= '<li>'.$this->faker->sentence().'</li>';
        $htmlContent .= '</ul>';

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(5),
            'status' => $status,
            'cover_image_path' => null,
            'content' => $htmlContent,
            'published_at' => $status === 'published' ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
