<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventRegistrationQuestion;
use App\Models\User;
use App\Enums\EventStatus;
use App\Enums\EventAccessType;
use App\Enums\EventRegistrationQuestionType;
use App\Enums\UserRole;
use Carbon\Carbon;
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

        $eventTitle = 'Up Coming Webinar';
        $event = Event::create([
            'title' => $eventTitle,
            'slug' => Str::slug($eventTitle),
            'category' => 'IT',
            'description' => 'Upcoming Events',
            'starts_at' => now()->addDays(5)->setHour(19)->setMinute(0),
            'ends_at' => now()->addDays(5)->setHour(21)->setMinute(0),
            'meeting_provider' => 'google_meet',
            'meeting_url' => 'https://meet.google.com/',
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
            'label' => 'Apa tingkat pengalaman Anda menggunakan di bidang ini?',
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

        $eventTitle2 = 'Webinar: Strategi Keamanan Digital di Era Cyber';

        $descriptionHtml = '
            <p><strong>WEBINAR: "Strategi Keamanan Digital di Era Cyber"</strong></p>
            <p>Di era digital, menjaga keamanan data adalah hal wajib. Webinar ini akan memberikan langkah-langkah terbaik untuk melindungi privasi Anda dari serangan siber dan menjaga informasi penting tetap aman.</p>
            <p>
                🗓️ Sabtu, 21 September 2024<br>
                ⏰ Jam 8 malam - selesai<br>
                📍 Google Meet<br>
                💰 Biaya Pendaftaran: 25K
            </p>
            <p>Webinar ini cocok untuk siapa saja, baik pemula yang ingin belajar dunia IT maupun yang ingin memahami lebih dalam tentang keamanan digital. Dengan materi yang mudah dipahami, Anda akan langsung bisa menerapkannya dalam kehidupan sehari-hari.</p>
            <p>Mari tingkatkan kesadaran akan keamanan digital dan persiapkan diri menghadapi tantangan siber. Pelajari cara melindungi informasi penting dan menjaga privasi di era modern.</p>
        ';

        Event::create([
            'title' => $eventTitle2,
            'slug' => Str::slug($eventTitle2),
            'category' => 'Cyber Security',
            'description' => trim($descriptionHtml),
            'starts_at' => Carbon::create(2024, 9, 21, 20, 0, 0),
            'ends_at' => Carbon::create(2024, 9, 21, 22, 0, 0),
            'meeting_provider' => 'google_meet',
            'meeting_url' => null,
            'status' => EventStatus::Completed,
            'access_type' => EventAccessType::Paid,
            'is_published' => true,
            'created_by' => $admin->id,
            'mentor_id' => $mentor->id,
        ]);


        $this->command->info('2 Event berhasil di-generate (Event 2 dibuat menggunakan WYSIWYG html, Completed, & Paid)!');
    }
}
