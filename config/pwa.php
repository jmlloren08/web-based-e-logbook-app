<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Would you like the install button to appear on all pages?
      Set true/false
    |--------------------------------------------------------------------------
    */

    'install-button' => true,

    /*
    |--------------------------------------------------------------------------
    | PWA Manifest Configuration
    |--------------------------------------------------------------------------
    |  php artisan erag:pwa-update-manifest
    */

    'manifest' => [
        'name' => 'eLogbook',
        'short_name' => 'eLogbook',
        'background_color' => '#6777ef',
        'display' => 'fullscreen',
        'description' => 'Track and manage documents efficiently.',
        'theme_color' => '#6777ef',
        'icons' => [
            [
                'src' => '/images/icons/icon-512x512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
        ],
        'screenshots' => [
            [
                'src' => '/images/screenshots/desktop-1334-750.jpg',
                'sizes' => '1334x750',
                'type' => 'image/jpg',
                'form_factor' => 'wide',
            ],
            [
                'src' => '/images/screenshots/mobile-640-1136.jpg',
                'sizes' => '640x1136',
                'type' => 'image/jpg',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Debug Configuration
    |--------------------------------------------------------------------------
    | Toggles the application's debug mode based on the environment variable
    */

    'debug' => env('APP_DEBUG', false),

];
