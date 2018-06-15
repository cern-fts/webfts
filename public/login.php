<?php
require __DIR__ . '/../vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;
use Jumbojett\OpenIDConnectClientException;

session_start();

$config = include('../config.php');

$provider = $config['oidc_provider'][$_POST['provider']];
$oidc = new OpenIDConnectClient(
    $provider['issuer'], $provider['client_id'], $provider['client_secret']
);

$oidc->addScope('openid');
$oidc->addScope('profile');

// IAM says it supports client_secret_basic, but it actually doesn't
$oidc->providerConfigParam(array(
    'token_endpoint_auth_methods_supported' => ['client_secret_post']
));

// TODO Remove: This is only to allow HTTP testing
$_SERVER["HTTP_UPGRADE_INSECURE_REQUESTS"] = 0;

try {
    $oidc->authenticate();  // This (might) redirect to IDP
    $oidc->requestClientCredentialsToken();
    $_SESSION["oidc"] = $oidc;

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
