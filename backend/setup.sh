#!/bin/bash
composer install

cat > .env <<EOT
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite

OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_SERVICE_NAME=flight-backend
OTEL_TRACES_EXPORTER=otlp
#OTEL_LOGS_EXPORTER=none
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
EOT

php artisan key:generate
php artisan migrate
php artisan db:seed
