<?php
require __DIR__ . '/../vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;

$name = $_SESSION['user_info']->given_name
      . " "
      . $_SESSION['user_info']->family_name;

$provider = $config['oidc_provider'][$_SESSION['provider_num']]['description'];
?>

<div class="navbar-left btn-group">
    <?php
    echo <<<HTML
    <strong>Logged in as</strong> $name, <strong>via</strong> $provider
HTML;
    ?>
</div>
