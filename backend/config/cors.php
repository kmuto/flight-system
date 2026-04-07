<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // ReactアプリのURLを指定（Viteのデフォルト）
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    // traceparent を許可することで、フロントエンドとバックエンドのトレースが繋がります
    'allowed_headers' => ['*', 'traceparent'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
