<?php


namespace App\Models;


use App\Support\Security;
use Slim\Http\ServerRequest as Request;
use Slim\Psr7\UploadedFile;

class ImagesManager extends DatabaseModel
{
    private Security $_security;

    public function __construct(Security $security)
    {
        $this->_security = &$security;
    }

    private function _hasAuthorization()
    {
        $token = $this->_security->authToken();
        return $this->tokenCheck($token);
    }

    public function getImage()
    {
        $security   = &$this    -> _security;
        $get        = $security -> getFilteredGet('image');

        if ($get)
        {
            $imgsDirectory      = resources_path('images');
            $scannedDirectory  = array_diff(scandir($imgsDirectory), array('..', '.'));
            $selectedImage = '';
            foreach ($scannedDirectory as $file) {
                if (pathinfo($file, PATHINFO_BASENAME) === $get)
                {
                    $selectedImage = $file;
                }
            }
            $imgSource          = $imgsDirectory . '/' . $selectedImage; // image path/name

            if (!file_exists($imgSource))
            {
                return api_response(404, 'Not Found', 'Image introuvable');
            }

            $imgExt         = pathinfo($imgSource, PATHINFO_EXTENSION);
            $open           = fopen($imgSource, 'rb');
            $read           = fread($open,filesize($imgSource));
            fclose($open);
            $content        = [
                'title' =>
                    $get,
                'src'   =>
                    'data:image/' . $imgExt . ';charset=utf-8;base64,' . base64_encode($read)
            ];

            return api_response(200, 'Success', $content);
        }

        return api_response(400, 'Error', 'Requête invalide');
    }

    public function getImagesArray()
    {
        $imgsDirectory          = resources_path('images');
        $scannedDirectory      = array_diff(scandir($imgsDirectory), array('..', '.'));

        $content = [];
        foreach ($scannedDirectory as $imgName) {
            $imgSource  = $imgsDirectory . '/' . $imgName; // image path/name
            $imgExt     = pathinfo($imgSource, PATHINFO_EXTENSION);
            $open       = fopen($imgSource, 'rb');
            $read       = fread($open,filesize($imgSource));
            fclose($open);
            $data       = [
                'title' =>
                    $imgName,
                'src'   =>
                    'data:image/' . $imgExt . ';charset=utf-8;base64,' . base64_encode($read)
            ];
            $content[]  = $data;
        }

        return api_response(200, 'Success', $content);
    }

    public function deleteImage(Request $request)
    {
        return $this->_deleteImage($request);
    }

    private function _deleteImage(Request $request)
    {
        $security   = &$this->_security;
        $security->setRequest($request);
        $auth       = $this->_hasAuthorization();

        if (empty($auth))
        {
            return api_response(
                401,
                'Unauthorized',
                'Erreur, veuillez vous authentifier'
            );
        }

        $delete     = $security->getFilteredGet('image');
        if ($delete)
        {
            $imgsDirectory  = resources_path('images');
            $imgSource      = $imgsDirectory . '/' . $delete; // image path/name

            if (file_exists($imgSource))
            {
                fclose($imgSource);
                unlink($imgSource);

                $content = $delete . ' a été supprimé avec succès';
                return api_response(200, 'Success', $content);
            }
        }

        return api_response(400, 'Error', 'Requête invalide');
    }

    public function uploadImage(Request $request)
    {
        return $this->_uploadImage($request);
    }

    private function _uploadImage(Request $request)
    {
        $this->_security->setRequest($request);
        $auth = $this->_hasAuthorization();

        if (empty($auth))
        {
            return api_response(
                401,
                'Unauthorized',
                'Erreur, veuillez vous authentifier'
            );
        }

        $directory      = resources_path('images');
        $validExt       = array("jpg", "png", "jpeg", "bmp", "gif");
        $uploadedFiles  = $request->getUploadedFiles();
        $content        = '';

        // handle single input with multiple file uploads
        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile->getError() === UPLOAD_ERR_OK) {

                $fileName   = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
                $fileExt    = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);

                if (($uploadedFile->getSize() > 0) && (in_array($fileExt, $validExt, true)))
                {
                    $filename = $this->_moveUploadedFile($directory, $uploadedFile, $fileName);

                    if (!empty($filename)) {
                        $content        .= 'Envoi de ' . $filename . ' aboutit.<br/>';
                        $code           = 201;
                        $message        = 'Image uploaded successfully';
                    }
                } else {
                    $content    .= 'Erreur, fichier invalide';
                    $code       = 400;
                    $message    = 'Image upload failed';
                }
            }
        }

        return api_response($code, $message, $content);

    }

    private function _moveUploadedFile($directory, UploadedFile $uploadedFile, $basename = null)
    {
        $extension  = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename   ?: $basename = bin2hex(random_bytes(8)) . $extension;

        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $basename);

        return $basename;
    }
}