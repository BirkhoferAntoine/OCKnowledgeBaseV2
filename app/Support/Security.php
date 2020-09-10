<?php

namespace App\Support;

use Slim\Http\ServerRequest as Request;

/**
 * Class ControllerSecurity
 */
class Security
{
    private $_add_empty;
    private $_filteredUri;
    private $_filteredGet;
    private $_filteredParams;
    private $_filteredToken;
    private $_filteredIp;
    private Request $_request;
    private $_authToken;

    /**
     * Security constructor.
     */
    public function __construct()
    {
    }

    /**
     * @param $request
     * @return void
     */
    private function _setRequest(Request $request)
    {
        return $this->_request = $request;
    }

    public function setRequest(Request $request)
    {
        return $this->_setRequest($request);
    }

    public function authToken($token = null)
    {
        return $this->_authToken($token);
    }

    private function _authToken($token = null)
    {
        $token  ?: $token = $this->getFilteredToken();
        $ip     = $this->getFilteredIp();

        if (!empty($token && $ip)) {
            $this->_authToken = hash_hmac('sha256', $token, $ip);
            return $this->_authToken;
        }
        return false;
    }

    public function getFilteredToken()
    {
        $headerToken            = $this->_request->getHeaderLine('Authorization');
        $sessFilters            = config('security.session.authorization');
        $this->_filteredToken   = filter_var($headerToken, $sessFilters['filter'], $sessFilters['flags']);
        return $this->_filteredToken;
    }

    public function getFilteredIp()
    {
        $ip                 = $this->_request->getServerParam('REMOTE_ADDR');
        $srvFilters         = config('security.server.ip');
        $this->_filteredIp  = filter_var($ip, $srvFilters);
        return $this->_filteredIp;
    }

    /**
     * @param null $key
     * @return mixed|null
     */
    public function getFilteredUri($key = null)
    {
        $uri                = $this->_request->getUri();
        $uriFilters         = config('security.uri');
        $this->_filteredUri = filter_var($uri, $uriFilters);
        if ($key === null)                      return $this->_filteredUri;
        if (isset($this->_filteredUri[$key]))   return $this->_filteredUri[$key];
        return null;
    }

    /**
     * @param null|string $key
     * @return mixed|null
     */
    public function getFilteredGet($key = null)
    {
        $inputFilters           = config('security.get');
        $this->_filteredGet     = filter_input_array(INPUT_GET, $inputFilters, $this->_add_empty);

        if ($key === null)                      return $this->_filteredGet;
        if (isset($this->_filteredGet[$key]))   return $this->_filteredGet[$key];
        return null;
    }

    /**
     * @param $array
     * @return mixed|null
     */
    public function getFilteredParams()
    {
        $params = $this->_request->getParams();
        if ($params !== null) {
            $inputFilters                   = config('security.post');
            $this->_filteredParams          = filter_var_array($params, $inputFilters, $this->_add_empty);
            return $this->_filteredParams;
        }
        if ($params === null)                        return $this->_filteredParams;
        return null;
    }

    protected function filterSQL($str)
    {
        return str_replace('`', '', $str);
    }

    public function setSQLValue($param, $value)
    {
        return array(':' . $param => $value);
    }

    public function setSQLParameter($param): string
    {
        return '`' . $param . '` = :' . $param;
    }

    public function prepareSQLParameters($get = null) : string
    {
        $sqlParams = '';

        if ($get) {
            if (is_array($get))
            {
                $getKeys = array_keys($get);

                foreach ($getKeys as $param) {
                    $sqlParams .= $this->setSQLParameter($param) . ' AND ';
                }

                $sqlParams = substr($sqlParams, 0, -4);
            } else {
                $sqlParams = $this->setSQLParameter($get);
            }
        }
        return $sqlParams;
    }

    public function prepareSQLValues($array = null) : array
    {
        $keyArrays      = [];
        $valuesArray    = [];

        if ($array) {
            foreach ($array as $key => $value) {
                $keyArrays[]    =   ':' . $key;
                $valuesArray[]  =   $value;
            }
        }
        return array_combine($keyArrays, $valuesArray);
    }
}

