<?php

return [
        'cookies' => [
            defined('COOKIE_SECURE') ?: define('COOKIE_SECURE', true),
            defined('COOKIE_HTTPONLY') ?: define('COOKIE_HTTPONLY', true),
            defined('COOKIE_PATH') ?: define('COOKIE_PATH', '/'),
            defined('COOKIE_ROOT_DOMAIN') ?: define('COOKIE_ROOT_DOMAIN', '.ockb.rongeasse.com'),
            defined('COOKIE_NAME') ?: define('COOKIE_NAME', 'admin'),
            defined('COOKIE_LIFETIME') ?: define('COOKIE_LIFETIME', 3600),
        ],

];
