<?php
// No direct access to this file 
define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'); 
if(!IS_AJAX) {die('Restricted access');}

foreach($_SERVER as $h=>$v){
      if ($h == "SSL_CLIENT_S_DN_CN_2")
         $clientCN = $v;
      else if ($h == "SSL_CLIENT_S_DN_CN")
          $clientCN = $v;
      }
echo shell_exec("./utils/getCNfromCertificate.sh \"$clientCN\"");
?>
