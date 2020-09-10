<?php
declare(strict_types=1);

namespace App\Middleware;

use Slim\App;
use App\Support\Security;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface as Middleware;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class SecurityMiddleware extends Security implements Middleware
{
    /**
     * @inheritDoc
     */
    public function process(Request $request, RequestHandler $handler): Response
    {
        {
            // Add get, post, session attributes to request
            $request = $request->withAttribute('securityPost',      $this->getFilteredPost());
            $request = $request->withAttribute('securityGet',       $this->getFilteredGet());
            $request = $request->withAttribute('securitySession',   $this->getFilteredSession());
            $request = $request->withAttribute('securityParams',    $this->getFilteredParams());
            $request = $request->withAttribute('security',          $this);
        }

        return $handler->handle($request);
    }
}