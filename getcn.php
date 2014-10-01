<?php
                foreach($_SERVER as $h=>$v){
                        if ($h == "SSL_CLIENT_S_DN_CN_2")
                                $clientCN = $v;
                        else if ($h == "SSL_CLIENT_S_DN_CN")
                                $clientCN = $v;
                }
                echo shell_exec("./utils/getCNfromCertificate.sh \"$clientCN\"");
?>
