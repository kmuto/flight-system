#!/bin/sh
composer install

cat > .env <<EOT
APP_ENV=local
APP_DEBUG=true
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=flight_db
DB_USERNAME=user
DB_PASSWORD=password
EOT

php artisan key:generate
php artisan migrate
php artisan db:seed
