<?php


namespace App\Providers;

use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;


class EnvironmentVariablesServiceProvider extends ServiceProvider
{
    public function register()
    {
        try {
            $env = Dotenv::createImmutable(base_path());
            $env->load();
        } catch (InvalidPathException $e) {
            throw new FileNotFoundException('Environment not found');
        }
    }

    public function boot()
    {
        //
    }
}