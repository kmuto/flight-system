<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Flight extends Model
{
    //
    use HasFactory;
    protected $fillable = ['flight_number', 'airline', 'origin', 'destination', 'departure_at', 'price'];
}
