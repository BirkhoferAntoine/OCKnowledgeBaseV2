<?php

use App\Support\Route;

Route::post(    '/api/v1/login',                'APIController@login');
Route::get(     '/api/v1/get',                  'APIController@get');
Route::post(    '/api/v1/post',                 'APIController@post');
Route::put(     '/api/v1/put',                  'APIController@put');
Route::delete(  '/api/v1/delete',               'APIController@delete');
Route::get(     '/api/v1/getimage',             'APIController@getImage');
Route::delete(  '/api/v1/deleteimage',          'APIController@deleteImage');
Route::get(     '/api/v1/images',               'APIController@showImages');
Route::post(    '/api/v1/upload',               'APIController@uploadImage');
