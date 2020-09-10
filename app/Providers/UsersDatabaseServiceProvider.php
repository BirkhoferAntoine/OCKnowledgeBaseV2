<?php


namespace App\Providers;

use App\Models\UsersModelManager;
use App\Support\Security;
use Symfony\Component\Debug\Exception\ClassNotFoundException;

class UsersDatabaseServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
        $this->app->getContainer()->set(UsersModelManager::class, function()
        {
            return new UsersModelManager(new Security());
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