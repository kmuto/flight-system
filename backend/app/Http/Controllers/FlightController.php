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
        $span->setAttribute('app.search.origin', $request->query('origin', 'any'));

        // 2. データベースから取得（SQLスパンが生成される）
        $flights = Flight::limit(1000)->get();

        // 3. 重い処理のシミュレーション
        // transformの中で少し待機を入れることで、トレースの「幅」を作ります
        $flights->transform(function ($flight) {
            // 0.5ミリ秒（500マイクロ秒）待機
            usleep(500); 
            
            // 正しいPHPの文法で文字列を作成
            $flight->display_price = "JPY " . number_format($flight->price);
            
            return $flight;
        });

        return response()->json($flights);
    }
}
