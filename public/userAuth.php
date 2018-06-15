<?php
require __DIR__ . '/../vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;

session_start();
$config = include('../config.php');
?>

<div class="navbar-left btn-group">
    <?php if(isset($_SESSION['oidc'])
             && $_SESSION['oidc']->getAccessToken() != null
             && ($_SESSION['user_info'] = $_SESSION['oidc']->requestUserInfo())
                                                           ->sub != null) {
        require '../include/userinfo.php';
    } else {
        require '../include/loginbtn.php';
    }?>
</div>
