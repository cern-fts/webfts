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


    public function dm_list($base, $dir_name) {
        return $this->get("dm/list", array(
            "surl" => joinURLs($base, $dir_name)
        ));
    }

    public function dm_mkdir($base, $dir_name) {
        return $this->post("dm/mkdir", array(
            "surl" => joinURLs($base, $dir_name)
        ));
    }

    public function dm_rmdir($base, $dir_name) {
        return $this->post("dm/rmdir", array(
            "surl" => joinURLs($base, $dir_name)
        ));
    }

    public function dm_unlink($base, $file_name) {
        return $this->post("dm/unlink", array(
            "surl" => joinURLs($base, $file_name)
        ));
    }

    public function dm_rename($base, $old, $new) {
        return $this->post("dm/rename", array(
            "old" => joinURLs($base, $old),
            "new" => joinURLs($base, $new),
        ));
    }


    private function get($path, $data = null) {
        if ($data != null) {
            $path = $path . "?" . http_build_query($data);
        }

        error_log("cURL: GET $this->base_url/$path");

        $c = $this->curl_init($path);
        return $this->curl_exec($c);
    }

    private function post($path, $data) {
        error_log("cURL: POST $this->base_url/$path " . json_encode($data));
        $c = $this->curl_init($path, array("Content-Type: application/json"));
        curl_setopt($c, CURLOPT_POST, true);
        curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($data));
        return $this->curl_exec($c);
    }

    private function curl_init($path, $headers = array()) {
        $url = $this->base_url . '/' . $path;
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
        if (isset($this->access_token)) {
            curl_setopt($c, CURLOPT_HTTPHEADER,
                        array_merge(array("Authorization: Bearer $this->access_token",
                                          "Accept: application/json"),
                                    $headers));
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
