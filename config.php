<?php
return array(
    'fts_url' => 'https://fts3-xdc.cern.ch:8446',

    'oidc_provider' => array(
        array(
            'description' => 'Example',
            'issuer' => 'http://foo',
            'client_id' => 'bar',
            'client_secret' => 'baz',

    'public' => array(
        'lmt' => array(
            'websocket_endpoint' => 'wss://lmt.cern.ch:8080/socket',
            'health_check_endpoint' => 'https://lmt.cern.ch:8080/health-check',
        )
        'endpoint_list_url' => 'https://webfts.cern.ch/endpointList',
        'cernbox_base_url' => 'root://eosdevbox.cern.ch/eos/devbox/user/',

        'proxy_cert_hours' => 12,
        'job_to_list' => 100,

        'vos' => array(
            'auger',
            'biomed',
            'bitface',
            'cms',
            'dteam',
            'lhcb',
            'ops',
        ),
    ),
);
?>
