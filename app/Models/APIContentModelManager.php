<?php

declare(strict_types=1);

namespace App\Models;

use App\Support\Security;
use PDO;


class APIContentModelManager extends DatabaseModel
{
    private $_security;

    public function __construct(Security $security)
    {
        $this->_security = &$security;
    }

    public function setRequest($request)
    {
        return $this->_security->setRequest($request);
    }

    private function _hasAuthorization()
    {
        $token = $this->_security->authToken();
        return $this->tokenCheck($token);
    }

    private function _get()
    {
        $security   = &$this    -> _security;
        $get        = $security -> getFilteredGet();

        if ($get)
        {
            switch ($get)
            {
                case (isset($get['categories'])     && $get['categories'] === 'true') :
                    $sql = 'SELECT * FROM `categories` ORDER BY `id`';
                    break;
                case (isset($get['content'])        && $get['content'] === 'true') :
                    $sql = 'SELECT * FROM `content` ORDER BY `id`';
                    break;
                default : break;
            }
            if (!empty($sql))
            {
                $req = $this->run($sql);
            } else {

                $sqlParams  = $security -> prepareSQLParameters($get);
                $sqlValues  = $security -> prepareSQLValues($get);

                switch ($get)
                {
                    case (isset($get['category_name'])) :
                        $sql        = 'SELECT * FROM `categories` WHERE ' . $sqlParams . ' ORDER BY `id`';
                        break;
                    default: $sql   = 'SELECT * FROM `content` WHERE ' . $sqlParams . ' ORDER BY `id`';
                        break;
                }
                $req = $this->run($sql, $sqlValues);
            }
        }
        if (isset($req)) {

            $content = $req->fetchAll();
            $req->closeCursor();

            return api_response(
                200,
                'Success',
                $content
            );
        }
        return api_response(
            404,
            'Not found',
            'Objet de la recherche introuvable'
        );
    }



    private function _add()
    {
        $security   = &$this->_security;
        $auth       = $this->_hasAuthorization();

        if (empty($auth))
            {
                return api_response(
                    401,
                    'Unauthorized',
                    'Erreur, veuillez vous authentifier'
                );
            }

        $post = $security->getFilteredParams();

        if (!empty($post['title'] && $post['content'] && $post['category'] && $post['sub_category']))
        {
            $post['user_name']  = 'Admin';
            $sql = "INSERT INTO `content` 
                        (`id`, `user_name`, `title`, `content`, `date`, `image`, `category`, `sub_category`) 
                    VALUES 
                        (NULL, :user_name , :title , :content , NOW() , :image , :category , :sub_category)";
            $content = $this->run($sql, $post)->rowCount();
        }
        if ($content) {
            return api_response(
                201,
                'Created',
                $content
            );
        }
        return api_response(
            404,
            'Error',
            'Erreur, requête incorrecte'
        );
    }

    private function _update()
    {
        $security   = &$this->_security;
        $auth       = $this->_hasAuthorization();

        if (empty($auth))
        {
            return api_response(
                401,
                'Unauthorized',
                'Erreur, veuillez vous authentifier'
            );
        }

        $put                = $security -> getFilteredParams();
        $put['user_name']   = 'Admin';

        if ($put['id']) {
            $sql = "UPDATE `content` SET
				`user_name` 	= :user_name,
				`title`         = :title,
                `content`       = :content,
                `date`          = NOW(),
                `image`         = :image, 
                `category`      = :category, 
                `sub_category`  = :sub_category
			    WHERE 
			    `content`.`id`  = :id";

            $content = $this->run($sql, $put)->rowCount();
            return api_response(
                200,
                'Success',
                $content
            );
        }
        return api_response(
            404,
            'Error',
            'Erreur, requête incorrecte'
        );
    }

    private function _delete()
    {
        $security   = &$this->_security;
        $auth       = $this->_hasAuthorization();

        if (empty($auth))
        {
            return api_response(
                401,
                'Unauthorized',
                'Erreur, veuillez vous authentifier'
            );
        }

        $delete = $security->getFilteredGet();

        if (!empty($delete['category']))
        {
            $sql        = "DELETE FROM `categories` WHERE `categories`.`id` = :id";
            $content    = $this->run($sql, [':id' => $delete['category']])->rowCount();
        }
        if (!empty($delete['content']))
        {
            $sql        = "DELETE FROM `content` WHERE `content`.`id` = :id";
            $content    = $this->run($sql, [':id' => $delete['content']])->rowCount();
        }
        if ($content) {
            return api_response(
                200,
                'Success',
                $content
            );
        }
        return api_response(
            404,
            'Error',
            'Erreur, requête incorrecte'
        );
    }

    public function get()
    {
        return $this->_get();
    }

    public function add()
    {

        return $this->_add();
    }

    public function update() {
        return $this->_update();
    }

    public function delete()
    {
        return $this->_delete();
    }
}
