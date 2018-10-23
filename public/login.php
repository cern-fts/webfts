<?php
require __DIR__ . '/../vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;
use Jumbojett\OpenIDConnectClientException;

session_start();

$config = include('../config.php');

$provider = null;
// TODO This is not DoS-safe, since we store state, before the user is authN'd
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['provider'])) {

    $_SESSION['provider_num'] = $_POST['provider'];
    $provider = $config['oidc_provider'][$_POST['provider']];
    $_SESSION['oidc'] = new OpenIDConnectClient(
        $provider['issuer'], $provider['client_id'], $provider['client_secret']
    );
} else {
    $provider = $config['oidc_provider'][$_SESSION['provider_num']];
}

$oidc = $_SESSION['oidc'];

$oidc->addScope('openid');
$oidc->addScope('offline_access');
if (isset($config['show_profile_name']) && $config['show_profile_name']) {
    $oidc->addScope('profile');
}

// IAM says it supports client_secret_basic, but it actually doesn't
$oidc->providerConfigParam(array(
    'token_endpoint_auth_methods_supported' => ['client_secret_post']
));

try {
    $oidc->authenticate();  // This (might) redirect to IDP
    $oidc->requestClientCredentialsToken();

    // TODO Dynamic return location
    header("Location: /index.php");
}
catch (OpenIDConnectClientException $e) {
    // TODO This message might reveal sensitive information
    echo <<<HTML
      <div class="alert alert-danger">
         <strong>Error:</strong> $e
      </div>
HTML;
}
?>
