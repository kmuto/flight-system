<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;
use OpenTelemetry\API\Trace\Span;

class FlightController extends Controller
{
    public function search(Request $request)
    {
        // 1. スパンに属性を追加（Jaegerで検索しやすくなります）
        $span = Span::getCurrent();
        $origin = $request->query('origin', '');
        $destination = $request->query('destination', ''); // 目的地を取得

        $span->setAttribute('app.search.origin', $origin);
        $span->setAttribute('app.search.destination', $destination);

        // --- 【出発地と目的地が同じならエラー】 ---
        $flights = Flight::where('origin', 'like', "%$origin%")
                         ->where('destination', 'like', "%$destination%")
                         ->paginate(15);

        $flights->getCollection()->transform(function ($flight) use ($origin, $destination) {
            // 【リアルなバグの種】
            // 本来は緯度経度で計算すべきだが、手抜きで「同じなら0」というロジック
            $distance = ($flight->origin === $flight->destination) ? 0 : 500; 

            // 燃料計算： (基本燃料 1000L) / (距離)
            // $distance が 0 のとき、ここで PHP は DivisionByZeroError を投げ、即死します。
            $fuelEfficiency = 1000 / $distance; 
            $flight->fuel_needed = $fuelEfficiency;
            $flight->display_price = "JPY " . number_format($flight->price);
            return $flight;
        });

        return response()->json($flights);
    }
}
