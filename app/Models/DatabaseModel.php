<?php

declare(strict_types=1);
namespace App\Models;


use PDO;
use PDOException;

// Classe abstraite car sert de point d'accès pour la BDD des utilisateurs
abstract class DatabaseModel
{
    // Variable contenant la base de données
    private static $_dbConnection;
    private const SALT_BYTES = 32;
    private const ALGORITHM = 'sha3-512';
    private const ITERATIONS = 10000;
    // Connection à la BDD suivant les directives du server
    /**
     *
     */
    private static function setDbConnection()
    {
        try {
            self::$_dbConnection = new PDO(
                'mysql:host=' . env('DB_HOST', '127.0.0.1') . '; dbname=' . env('DB_NAME', 'dbs372914') . '; charset=' .
                CHARSET . ';',
                env('DB_USERNAME', 'root'), env('DB_PASSWORD', ''),
                DBOPTIONS);
        }
            catch (PDOException $e)
        {
            if (env('APP_DEBUG', false)) throw new PDOException($e);
        }
    }

    // Vérifie si la connection est établie, se connecte si null et renvoie le resultat
    /**
     * @return mixed
     */
    protected function getDbConnection()
    {
        if (self::$_dbConnection === null)
        {
            self::setDbConnection();
        }
        return self::$_dbConnection;
    }

    protected function run($sql, $args = [])
    {
        try {
            if (!$args)
            {
                return $this->getDbConnection()->query($sql);
            }
            $stmt = $this->getDbConnection()->prepare($sql);
            $stmt->execute($args);

            return $stmt;
        } catch (PDOException $e) {
            if (env('APP_DEBUG', false))
                throw $e;
        }
    }

    protected function transaction($sql, $args = []) {
        $stmt = $this->getDbConnection()->prepare($sql);
        try {
            $this->getDbConnection()->beginTransaction();
            foreach ($args as $row)
            {
                $stmt->execute($row);
            }
            $this->getDbConnection()->commit();
        }catch (PDOException $e){
            $this->getDbConnection()->rollback();
            if (env('APP_DEBUG', false))
                throw $e;
        }
    }
    /**
     * Génère un salt "aléatoire"
     *
     * @return string
     * @throws Exception
     */
    protected function salter() {
        try {
            return bin2hex(random_bytes(self::SALT_BYTES));
        } catch (PDOException $e) {
            if (env('APP_DEBUG', false))
            return $e->getMessage();
        }
    }

    /**
     * Construit le mot de passe et utilise les arguments de l'utilisateur et de la BDD si c'est une connexion
     *
     * @param $password
     * @param $salt
     * @param $iterations
     * @return array
     * @throws Exception
     */
    protected function passwordBuilder($password, $salt, $iterations) {

        $hashSalt       = $salt ?? $this->salter();
        $hashIteration  = $iterations ? (int)$iterations : self::ITERATIONS;
        $hashPassword   = hash(self::ALGORITHM, $password, false);
        $finalPassword  = hash_pbkdf2(
            self::ALGORITHM,
            $hashPassword,
            $hashSalt,
            $hashIteration);

        return array(
            'iteration' => $hashIteration,
            'salt'      => $hashSalt,
            'password'  => $finalPassword
        );
    }

    protected function tokenCheck($token)
    {
        $sql = '
            SELECT 
               `user_level`
             FROM 
                `users` 
             WHERE 
                `users`.`token` = :token
                ';

        $args = [':token' => $token];

        $req = $this->run($sql, $args);

        if ($req) {

            $tokenCheck = $req->fetch();
            $req->closeCursor();

            return ($tokenCheck['user_level'] === '1');
        }
        return false;
    }
}