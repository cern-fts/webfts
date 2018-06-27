<?php namespace WebFTS;

use Exception;

/*
 * FTS3 REST API Client
 *See: https://fts3-docs.web.cern.ch/fts3-docs/fts-rest/docs/api.html
 */
class FTS3Client {
    /*
     * The URL of the FTS3 server
     */
    private $base_url;
    /*
     * Oauth2 access token to authenticate with the FTS3 server
     */
    private $access_token;

    public function __construct($base_url = null,
                                $access_token = null) {
        if ($base_url != null) {
            $this->base_url = $base_url;
        } else {
            $config = include(__DIR__ . '/../config.php');
            $this->base_url = $config['fts_url'];
        }

        if ($access_token != null) {
            $this->access_token = $access_token;
        } else if (isset($_SESSION['oidc'])
                   && ($access_token = $_SESSION['oidc']->getAccessToken()) != null){
            $this->access_token = $access_token;
        }
    }

    public function whoami() {
        return $this->get("whoami");
    }


    private function get($path) {
        $c = $this->curl_init($path);
        return $this->curl_exec($c);
    }

    private function post($path) {
        $c = $this->curl_init($path);
        curl_setopt($c, CURLOPT_POST, true);
        return $this->curl_exec($c);
    }

    private function curl_init($path) {
        $url = $this->base_url . '/' . $path;
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
        if (isset($this->access_token)) {
            curl_setopt($c, CURLOPT_HTTPHEADER, array("Authorization: Bearer $this->access_token"));
        }
        return $c;
    }

    private function curl_exec($c) {
        $result = curl_exec($c);

        if ($result === false) {
            throw new Exception("cURL Error: " . curl_error($c));
        } else {
            $status = curl_getinfo($c, CURLINFO_RESPONSE_CODE);

            if ($status === 200) {
                $result = json_decode($result);

                if ($result === null) {
                    throw new Exception("Invalid JSON: $result");
                } else {
                    return $result;
                }
            } else {
                throw new Exception("HTTP $status: $result");
            }
        }
    }
}

function joinURLs($component, ...$components) {
    $url = $component;
    foreach ($components as $component) {
        if (!empty($url) && $url[-1] != '/' && $component[0] != '/') {
            $url .= '/';
        }
        $url .= $component;
    }

    return $url;
}
?>
