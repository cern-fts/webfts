<?php namespace WebFTS;

use WebFTS\FTS3Exception;

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


    public function jobs($dlg_id = null,
                         $fields = null,
                         $time_window = null,
                         $limit = null,
                         $dest_se = null,
                         $source_se = null,
                         $state_in = null,
                         $vo_name = null,
                         $user_dn = null) {
        $params = array();
        if ($dlg_id != null)      { $params["dlg_id"] = $dlg_id; }
        if ($fields != null)      { $params["fields"] = $fields; }
        if ($time_window != null) { $params["time_window"] = $time_window; }
        if ($limit != null)       { $params["limit"] = $limit; }
        if ($dest_se != null)     { $params["dest_se"] = $dest_se; }
        if ($source_se != null)   { $params["source_se"] = $source_se; }
        if ($state_in != null)    { $params["state_in"] = $state_in; }
        if ($vo_name != null)     { $params["vo_name"] = $vo_name; }
        if ($user_dn != null)     { $params["user_dn"] = $user_dn; }

        return $this->get("jobs", $params);
    }

    public function submit_job($data) {
        return $this->post("jobs", $data);
    }

    public function delete_job($job_id) {
        return $this->post("jobs/$job_id", array(
            "_method" => "delete"  // TODO Why not use HTTP verb DELETE?
        ));
    }

    public function job_info($job_id, $field) {
        return $this->get("jobs/$job_id/$field");
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
            throw new FTS3Exception("cURL Error: " . curl_error($c));
        } else {
            $status = curl_getinfo($c, CURLINFO_RESPONSE_CODE);

            $parsed_result = json_decode($result);

            if ($status === 200) {
                if ($parsed_result === null) {
                    throw new FTS3Exception("Unparsable JSON response from FTS3 server: $result");
                } else {
                    return $parsed_result;  // Success!
                }
            } else {
                if ($parsed_result === null) {
                    throw new FTS3Exception($result, $status);
                } else {
                    throw new FTS3Exception(isset($parsed_result->message)
                                          ? $parsed_result->message
                                          : $parsed_result,
                                            $status);
                }
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
