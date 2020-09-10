<?php


namespace App\Providers;

use App\Support\Security;
use Slim\Http\ServerRequest as Request;

class SecurityServiceProvider extends ServiceProvider
{
    /**
     * @global $security
     * @param array $argsGet
     * @param array $argsPost
     */
    public function register()
    {
        try {
            $this->app->getContainer()->set(Security::class, function()
            {
                return new Security();
            });
            // Definition du dossier cible des téléchargements
            $this->app->getContainer()->set('upload_directory', resources_path('images'));
        } catch (Exception $e) {
        //if (env('APP_DEBUG', false))
          //  throw new ClassNotFoundException('Erreur ' . var_export(self::class) . ' n\'est pas fonctionnel', $e);
        }
    }

    public function boot()
    {
        // TODO: Implement boot() method.
    }
}
