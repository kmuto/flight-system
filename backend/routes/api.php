<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Flight;

// ここに記述したルートは自動的に /api プレフィックスがつきます
Route::get('/flights/search', function () {
    // 全件取得（動作確認用）
    return Flight::all();
});
