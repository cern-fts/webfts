<?php namespace WebFTS;

use Exception;

class FTS3Exception extends Exception {
    public getCode() {
        $code = parent::getCode();

        return $code != 0 ? $code : 500;
    }
}
?>
