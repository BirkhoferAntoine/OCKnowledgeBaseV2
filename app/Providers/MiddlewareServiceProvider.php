<?php


namespace App\Providers;

use Symfony\Component\Debug\Exception\ClassNotFoundException;

class MiddlewareServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
            $app = &$this->app;
            $app->addBodyParsingMiddleware();

            // This middleware will append the response header Access-Control-Allow-Methods with all allowed methods
            $app->options('/{routes:.+}', function ($request, $response, $args) {
                return $response;
            });

            $app->add(function ($request, $handler) {
                $response = $handler->handle($request);
                return $response
                    ->withHeader('Access-Control-Allow-Origin', 'https://ockb.rongeasse.com')
                    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                    // Optional: Allow Ajax CORS requests with Authorization header
                    ->withHeader('Access-Control-Allow-Credentials', 'true');
            });

        } catch (Exception $e) {
            if (env('APP_DEBUG', false))
                throw new ClassNotFoundException('Erreur ' . var_export(self::class) . ' n\'est pas fonctionnel', $e);
        }
    }

    public function boot()
    {

    }
}