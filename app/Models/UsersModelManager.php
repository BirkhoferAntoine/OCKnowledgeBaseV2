<?php


namespace App\Models;

use App\Support\Security;
use Slim\Http\ServerRequest as Request;
use PDO;


class UsersModelManager extends DatabaseModel
{
    private $_security;

    public function __construct(Security $security)
    {
        $this->_security = $security;
    }

    public function authentification()
    {
        return $this->_getUser();
    }

    public function setRequest($request)
    {
        return $this->_security->setRequest($request);
    }

    /**
     * Vérification des données de l'utilisateur pour permettre la connexion
     *
     * @param $params
     * @return mixed
     */

    private function _getUser()
    {
        $security       = &$this->_security;
        $filteredParams = $security->getFilteredParams();

        if ($filteredParams) {
            $sql = '
            SELECT 
                `user_name` ,
                `salt` ,
                `iteration`
             FROM 
                `users` 
             WHERE 
                `users`.`user_name` = :user_name
                ';
            $args = [
                'user_name' => $filteredParams['user_name']
            ];
            $req = $this->run($sql, $args);

            if (isset($req)) {
                $userCheck  = $req->fetch();
                $req->closeCursor();
            }

            if (!empty($userCheck)) {
                $passwordToVerify = $this->passwordBuilder(
                        $filteredParams['password'],
                        $userCheck['salt'],
                        $userCheck['iteration']);

                return $this->_passwordCheck(
                    $userCheck['user_name'],
                    $passwordToVerify['password']);
            }
            else {
                return [
                    'status' =>
                        ['code' => 401, 'message' => 'Error'],
                    'content' =>
                        'Utilisateur ou mot de passe incorrecte'
                ];
            }
        }
        return [
            'status' =>
                ['code' => 404, 'message' => 'Error'],
            'content' =>
                'Erreur, données invalides'
        ];
    }

    /**
     * Vérification du mot de passe
     *
     * @param $username
     * @param $password
     * @return mixed
     */
    private function _passwordCheck($username, $password) {

        $sql = '
            SELECT 
               `id`
             FROM 
                `users` 
             WHERE 
                `users`.`user_name` = :user_name
                AND
                `users`.`password`  = :password
                ';

        $args = [
            ':user_name'    => $username,
            ':password'     => $password
        ];

        $req = $this->run($sql, $args);

        if ($req) {

            $passCheck = $req->fetch();
            $req->closeCursor();

            if ($passCheck)
            {
                $clientToken    = config('tokens.createToken');
                $dbToken        = $this->_security->authToken($clientToken);
                $sql            = '
                    UPDATE `users` SET
                        `token`  = :token
                    WHERE 
                        `id`  = :id
                        ';
                $args           = [':token' => $dbToken, ':id' => $passCheck['id']];
                $req            = $this->run($sql, $args)->rowCount();
                
                if ($req)

                return [
                    'status' =>
                        ['code' => 301, 'message' => 'Login'],
                    'content' =>
                        $clientToken
                ];
            }
        }
        return [
            'status' =>
                ['code' => 401, 'message' => 'Error'],
            'content' =>
                'Utilisateur ou mot de passe incorrecte'
        ];
    }

}