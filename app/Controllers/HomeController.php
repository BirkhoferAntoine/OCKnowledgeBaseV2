<?php


namespace App\Controllers;

use App\Support\View;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;

class HomeController
{
    public function react(View $view) {
        if (!function_exists('mix')) {
            require('../helpers.php');
        }

        return $view('templates/web.twig', []
        );
    }
}