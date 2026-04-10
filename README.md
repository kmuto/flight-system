# 航空券検索デモ

ユーザーのブラウザ（フロントエンド）での実行から、リクエストを受け取るバックエンドサーバー内での処理まで、一連のトランザクションのトレースとして可視化されることを試せます。

- フロントエンド: Node.js 24.14
- バックエンド: PHP 8.5

## 起動
```
docker compose build
docker compose up -d mysql
docker compose run --rm frontend npm install
docker compose run --rm backend ./setup.sh
MACKEREL_APIKEY=<MackerelのAPIキー> docker compose up
```

## サイト
- http://localhost:5173 フロントエンド
- http://localhost:16686 Jaeger
- https://mackerel.io/ Mackerel APM

## 実行
- 出発地と目的地に地域を英語で記入すると、航空券が表示されます。地域は `backend/database/factories/FlightFactory.php` で作成しており、現時点では `'Tokyo', 'Osaka', 'Sapporo', 'Fukuoka', 'Okinawa', 'Nagoya'` です
- 出発地と目的地を同一にすると、燃料計算実行で0除算が発生し、例外が起きます。オブザーバリイティプラットフォームでこれを検知できます
- フロントエンド側のclickとsubmitに計装をかけています
- 現時点でフロントエンド、バックエンドともにlocalhostのOpenTelemetryコレクターにトレースを送っています。実際の運用では、フロントエンド側に何らかヘッダなどでトークンを付けてオブザーバビリティプラットフォームに送ることになるでしょう
