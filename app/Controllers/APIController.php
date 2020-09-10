<?php


namespace App\Controllers;


use App\Models\APIContentModelManager;
use App\Models\ImagesManager;
use App\Models\TokensModelManager;
use App\Models\UsersModelManager;
use App\Support\Security;
use App\Support\View;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\ServerRequest as Request;

class APIController
{

    private function _defaultResponse($data, View $view)
    {
        $payload        = json_encode($data['content'], JSON_PRETTY_PRINT);
        $defaultHeaders = ['name' => 'Content-Type', 'value' => 'application/json'];

        return $view('templates/api.twig',
            [
                'output' => $payload
            ],
            $defaultHeaders, $data['status']
        );
    }

    public function login(Request $request, View $view, UsersModelManager $usersManager)
    {
        $usersManager->setRequest($request);
        $auth = $usersManager->authentification();
        return $this->_defaultResponse($auth, $view);
    }

    public function get(View $view, APIContentModelManager $contentManager)
    {
        $data = $contentManager->get();

        return $this->_defaultResponse($data, $view);
    }

    public function post(Request $request, View $view,
                         APIContentModelManager $contentManager)
    {
        $contentManager->setRequest($request);
        $data = $contentManager->add();

        return $this->_defaultResponse($data, $view);
    }

    public function put(Request $request, View $view,
                        APIContentModelManager $contentManager)
    {
        $contentManager->setRequest($request);
        $data = $contentManager->update();

        return $this->_defaultResponse($data, $view);
    }

    public function delete(Request $request, View $view,
                           APIContentModelManager $contentManager)
    {
        $contentManager->setRequest($request);
        $data = $contentManager->delete();

        return $this->_defaultResponse($data, $view);
    }

    public function getImage(View $view, ImagesManager $imgManager)
    {
        $data = $imgManager->getImage();
        return $this->_defaultResponse($data, $view);
    }

    public function showImages(View $view, ImagesManager $imgManager)
    {
        $data = $imgManager->getImagesArray();
        return $this->_defaultResponse($data, $view);
    }

    public function deleteImage(Request $request, View $view,
                                ImagesManager $imgManager)
    {
        $data = $imgManager->deleteImage($request);
        return $this->_defaultResponse($data, $view);
    }

    public function uploadImage(Request $request, View $view,
                                ImagesManager $imgManager)
    {
        $data = $imgManager->uploadImage($request);
        return $this->_defaultResponse($data, $view);
    }
}