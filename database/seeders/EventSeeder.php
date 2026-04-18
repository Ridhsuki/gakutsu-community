<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventRegistrationQuestion;
use App\Models\User;
use App\Enums\EventStatus;
use App\Enums\EventAccessType;
use App\Enums\EventRegistrationQuestionType;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', UserRole::Admin)->first();
        $mentor = User::where('role', UserRole::Mentor)->first();


        if (!$admin || !$mentor) {
            $this->command->error('Admin atau Mentor tidak ditemukan! Pastikan seeder User sudah dijalankan.');
            return;
        }

        $eventTitle = 'Strategi Keamanan Digital: Melindungi Informasi di Era Cyber';
        $event = Event::create([
            'title' => $eventTitle,
            'slug' => Str::slug($eventTitle),
            'category' => 'Cyber Security',
            'description' => 'Dalam webinar ini, kita akan membedah berbagai best practices dan fitur terbaru dalam keamanan siber. Sangat cocok untuk pemula maupun yang ingin upgrade skill.',
            'starts_at' => now()->addDays(5)->setHour(19)->setMinute(0),
            'ends_at' => now()->addDays(5)->setHour(21)->setMinute(0),
            'meeting_url' => 'https://zoom.us/j/1234567890',
            'status' => EventStatus::Upcoming,
            'access_type' => EventAccessType::Free,
            'is_published' => true,
            'created_by' => $admin->id,
            'mentor_id' => $mentor->id,
        ]);

        EventRegistrationQuestion::create([
            'event_id' => $event->id,
            'label' => 'Dari mana Anda mengetahui event ini?',
            'type' => EventRegistrationQuestionType::ShortText,
            'is_required' => false,
            'options' => null,
        ]);

        EventRegistrationQuestion::create([
            'event_id' => $event->id,
            'label' => 'Apa tingkat pengalaman Anda menggunakan Kali Linux?',
            'type' => EventRegistrationQuestionType::Select,
            'is_required' => true,
            'options' => [
                'Pemula (Belum pernah / baru mulai)',
                'Menengah (1-3 Tahun)',
                'Mahir (> 3 Tahun)'
            ],
        ]);

        EventRegistrationQuestion::create([
            'event_id' => $event->id,
            'label' => 'Apa ekspektasi Anda setelah mengikuti webinar ini?',
            'type' => EventRegistrationQuestionType::LongText,
            'is_required' => true,
            'options' => null,
        ]);

        $this->command->info('Event dan Event Registration Questions berhasil di-generate!');
    }
}
