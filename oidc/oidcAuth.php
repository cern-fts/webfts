<script>
        if(!sessionStorage.oidcLogin) {
            OIDC.getConfig()
	}

	$("#oidclogin").click(function() {
            sessionStorage.oidcLoggedin=1;
        });
	if ($('#oidcalert').text() !== "") {
	    alert($('#oidcalert').text());
	}
	$("#oidclogout").click(function() {
            sessionStorage.clear();
	});
</script>
<?php
/**
 *  Copyright 2015 CERN
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
**/
 $conf = simplexml_load_file('config.xml');
 echo "<a class='button_log pull-right' id='oidclogin' href='" .  $conf->login_url . '&client_id=' . $conf->client_id . '&redirect_uri=' . $conf->redirect_uri . '&scope=' . $conf->scope . '&state=test' . "'><span class='glyphicon glyphicon-log-in' aria-hidden='true'> CILogon LogIn </span></a>";
?>
