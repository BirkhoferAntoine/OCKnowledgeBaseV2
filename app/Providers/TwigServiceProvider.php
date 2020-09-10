<?php


namespace App\Providers;

use App\Support\View;
use Slim\Psr7\Factory\ResponseFactory;
use Symfony\Component\Debug\Exception\ClassNotFoundException;

class TwigServiceProvider extends ServiceProvider
{

    public function register()
    {
        try {
            $this->app->getContainer()->set(View::class, function()
            {
                return new View(new ResponseFactory, $this->app);
            });} catch (Exception $e) {
            if (env('APP_DEBUG', false))
                throw new ClassNotFoundException('Erreur ' . var_export(self::class) . ' n\'est pas fonctionnel', $e);
        }
    }

    public function boot()
    {
        //
    }
}