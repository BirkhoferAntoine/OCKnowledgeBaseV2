<?php


namespace App\Providers;

use App\Models\ImagesManager;
use App\Support\Security;
use Symfony\Component\Debug\Exception\ClassNotFoundException;

class ImagesManagerServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
            $this->app->getContainer()->set(ImagesManager::class, function()
            {
                return new ImagesManager(new Security());
            });
        } catch (Exception $e) {
            if (env('APP_DEBUG', false))
                throw new ClassNotFoundException('Erreur ' . var_export(self::class) . ' n\'est pas fonctionnel', $e);
        }
    }

    public function boot()
    {
        //
    }
}