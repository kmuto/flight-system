<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Flight;

class FlightFactory extends Factory {
    protected $model = Flight::class;
    public function definition() {
        $cities = ['Tokyo', 'Osaka', 'Sapporo', 'Fukuoka', 'Okinawa', 'Nagoya'];
        return [
            'flight_number' => $this->faker->unique()->bothify('??###'), // aa123 形式
            'airline' => $this->faker->randomElement(['JAL', 'ANA', 'Peach', 'Jetstar']),
            'origin' => $this->faker->randomElement($cities),
            'destination' => $this->faker->randomElement($cities),
            'departure_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'price' => $this->faker->numberBetween(5000, 50000),
        ];
    }
}
