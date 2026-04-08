<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Flight; // ← モデルをインポート

class FlightFactory extends Factory {
    protected $model = Flight::class;
    public function definition() {
        return [
            'flight_number' => $this->faker->unique()->bothify('??###'), // AA123 形式
            'airline' => $this->faker->randomElement(['JAL', 'ANA', 'Peach', 'Jetstar']),
            'origin' => $this->faker->city(),
            'destination' => $this->faker->city(),
            'departure_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'price' => $this->faker->numberBetween(5000, 50000),
        ];
    }
}
