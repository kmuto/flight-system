<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('flight_number');    // 便名 (JL123など)
            $table->string('airline');          // 航空会社
            $table->string('origin');           // 出発地
            $table->string('destination');      // 目的地
            $table->dateTime('departure_at');   // 出発時刻
            $table->integer('price');           // 価格
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
