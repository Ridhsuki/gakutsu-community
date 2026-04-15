<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'アドミニストレータ',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Admin,
        ]);

        $mentor = User::factory()->create([
            'name' => 'Mentor User',
            'email' => 'mentor@gmail.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Mentor,
        ]);

        User::factory()->create([
            'name' => 'Member User',
            'email' => 'member@gmail.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Member,
        ]);

        // Generate User dummy
        // User::factory()->count(20)->create();

        // // Generate Blog Posts for Admin
        BlogPost::factory()->count(1)->create([
            'author_id' => $admin->id,
        ]);

        // // Generate 6 Blog Posts for Mentor
        // BlogPost::factory()->count(6)->create([
        //     'author_id' => $mentor->id,
        // ]);
    }
}
