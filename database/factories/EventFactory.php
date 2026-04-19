<?php

namespace Database\Factories;

use App\Enums\EventAccessType;
use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(mt_rand(4, 8));


        $startsAt = $this->faker->dateTimeBetween('now', '+3 months');
        $endsAt = Carbon::instance($startsAt)->addHours($this->faker->numberBetween(1, 4));
        $registrationClosesAt = Carbon::instance($startsAt)->subDays($this->faker->numberBetween(1, 5));

        return [
            'created_by' => User::factory(),
            'mentor_id' => User::factory(),
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'category' => $this->faker->randomElement([
                'Cyber Security',
                'UI/UX Design',
                'Web Development',
                'Data Science',
                'Mobile Dev',
                'DevOps'
            ]),
            'status' => $this->faker->randomElement(EventStatus::cases()),
            'access_type' => $this->faker->randomElement(EventAccessType::cases()),
            'is_published' => $this->faker->boolean(80),
            'registration_closes_at' => $registrationClosesAt,
            'meeting_provider' => $this->faker->randomElement(['zoom', 'google_meet', 'microsoft_teams']),
            'meeting_url' => $this->faker->url(),
            'poster_image_path' => null,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'description' => '<p>' . implode('</p><p>', $this->faker->paragraphs(3)) . '</p>',
        ];
    }

    /**
     * State: Event belum di-publish (Draft)
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => false,
        ]);
    }

    /**
     * State: Event sudah di-publish
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
        ]);
    }

    /**
     * State: Event status Upcoming (Akan datang dan bisa diregistrasi)
     */
    public function upcoming(): static
    {
        $startsAt = now()->addDays(10);
        return $this->state(fn(array $attributes) => [
            'status' => EventStatus::Upcoming,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addHours(2),
            'registration_closes_at' => $startsAt->copy()->subDays(2),
        ]);
    }

    /**
     * State: Event status Completed (Sudah selesai)
     */
    public function completed(): static
    {
        $startsAt = now()->subDays(10);
        return $this->state(fn(array $attributes) => [
            'status' => EventStatus::Completed,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addHours(2),
            'registration_closes_at' => $startsAt->copy()->subDays(2),
        ]);
    }

    /**
     * State: Event berbayar (Paid)
     */
    public function paid(): static
    {
        return $this->state(fn(array $attributes) => [
            'access_type' => EventAccessType::Paid,
        ]);
    }

    /**
     * State: Event Gratis (Free)
     */
    public function free(): static
    {
        return $this->state(fn(array $attributes) => [
            'access_type' => EventAccessType::Free,
        ]);
    }
}
