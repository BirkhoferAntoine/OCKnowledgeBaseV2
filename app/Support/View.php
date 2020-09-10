<?php

namespace App\Support;

use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;


class View
{
    private ResponseFactoryInterface $_factory;
    private $_app;

    public function __construct(ResponseFactoryInterface $factory, $app)
    {
        $this->_factory  = $factory;
        $this->_app      = &$app;
    }

    public function __invoke(string $template = '', array $with = [], $header = null, $status = null) : ResponseInterface
    {
        $app = &$this->_app;

        if ($status)    {
            $response = $this->_factory->createResponse($status['code'], $status['message']);
        } else {
            $response = $this->_factory->createResponse(200, 'Success');
        }

        $cache          = config('twig.cache');
        $path           = resources_path('views');


/*        $this->app->options('/{routes:.+}', function ($request, $response, $args) {
            return $response;
        });*/

        // Create Twig
        $twig = Twig::create($path, $cache);

        // Add Twig-View Middleware
        $app->add(TwigMiddleware::create($app, $twig));

        // Render Twig
        $twig->render($response, $template, $with);
        
        if ($header) {
            return $response->withHeader($header['name'], $header['value'])
                ->withHeader('Access-Control-Allow-Origin', 'https://ockb.rongeasse.com')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                // Optional: Allow Ajax CORS requests with Authorization header
                ->withHeader('Access-Control-Allow-Credentials', 'true');
        }
            return $response;
    }
}