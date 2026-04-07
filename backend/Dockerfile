FROM php:8.2-fpm

# 依存パッケージのインストール
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo_mysql zip

# OpenTelemetry PHP拡張のインストール
RUN pecl install opentelemetry \
    && docker-php-ext-enable opentelemetry

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
