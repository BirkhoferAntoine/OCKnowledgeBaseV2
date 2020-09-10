<?php

return [
    /* Environment variables */
        'name'      => env('APP_NAME', 'KnowledgeBase'),
        'env'       => env('APP_ENV', 'remote'),
        'app_debug' => env('APP_DEBUG', false),
        'url'       => env('APP_URL', 'https://ockb.rongeasse.com'),

    /* App Service Providers */
        'providers' => [
            \App\Providers\EnvironmentVariablesServiceProvider::class,
            \App\Providers\SecurityServiceProvider::class,
            \App\Providers\MiddlewareServiceProvider::class,
            \App\Providers\ErrorMiddlewareServiceProvider::class,
            \App\Providers\RouteServiceProvider::class,
            \App\Providers\TwigServiceProvider::class,
            \App\Providers\UsersDatabaseServiceProvider::class,
            \App\Providers\APIContentDatabaseServiceProvider::class,
            \App\Providers\ImagesManagerServiceProvider::class,
            ]
];