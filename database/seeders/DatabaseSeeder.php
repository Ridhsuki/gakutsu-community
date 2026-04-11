<?php

namespace Database\Seeders;

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
        User::factory()->create([
            'name' => 'アドミニストレータ',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Admin,
        ]);

        User::factory()->create([
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
    }
}
