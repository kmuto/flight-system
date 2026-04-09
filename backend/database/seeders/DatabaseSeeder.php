<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\Flight::create(['flight_number' => 'JL123', 'origin' => 'HND', 'destination' => 'ITM', 'price' => 12000]);
        \App\Models\Flight::factory(1000)->create();
    }
}
