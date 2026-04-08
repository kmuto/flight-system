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
        $origin = $request->query('origin', 'any');
        $destination = $request->query('destination', ''); // 目的地を取得

        $span->setAttribute('app.search.origin', $origin);
        $span->setAttribute('app.search.destination', $destination);

        // --- 【出発地と目的地が同じならエラー】 ---
        if (!empty($origin) && !empty($destination) && $origin === $destination) {
            abort(500, 'Internal Error');
        }

        // 1. データベースから検索（ページネーション）
        $flights = Flight::where('origin', 'like', "%$origin%")
                         ->where('destination', 'like', "%$destination%")
                         ->paginate(15);

        // 2. コレクションに対して「重い処理」と「フォーマット」を適用
        $flights->getCollection()->transform(function ($flight) {
            // 0.5ミリ秒わざと待機（トレースに隙間を作る）
            usleep(500); 
        
            // 抜けていたフォーマット処理を復活
            $flight->display_price = "JPY " . number_format($flight->price);
        
            return $flight;
        });

        return response()->json($flights);
    }
}
