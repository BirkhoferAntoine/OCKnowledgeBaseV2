<?php


namespace App\Providers;

use App\Support\Security;
use App\Models\APIContentModelManager;

class APIContentDatabaseServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
            $this->app->getContainer()->set(APIContentModelManager::class, function()
            {
                return new APIContentModelManager(new Security());
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