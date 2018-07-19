<?php
require __DIR__ . '/../vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;

$config = include('../config.php');

$name;
if (isset($_SESSION['user_info']->given_name) && $_SESSION['user_info']->family_name) {
    $name = $_SESSION['user_info']->given_name
          . " "
          . $_SESSION['user_info']->family_name;
} else {
    $name = $_SESSION['oidc']->getVerifiedClaims('sub');
}

$provider = $config['oidc_provider'][$_SESSION['provider_num']]['description'];
?>

<div class="navbar-left">
    <?php
    echo <<<HTML
    <strong>Logged in as</strong> $name, <strong>via</strong> $provider
HTML;
    ?>
</div>
