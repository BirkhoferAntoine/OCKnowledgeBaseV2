<?php


namespace App\Models;

use App\Models\DatabaseModel;

class TokensModelManager extends DatabaseModel
{
    public function authCheck($token = null)
    {
        if ($token !== null) {
            return $this->tokenCheck($token);
        }
            return false;
    }
}