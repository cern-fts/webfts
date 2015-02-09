<script>
	$("#ssologin").click(function() {
		sessionStorage.ssoLoggedin=1;
        });
	if ($('#ssoalert').text() !== "") {
		alert($('#ssoalert').text());
	}
	$("#ssologout").click(function() {
		sessionStorage.clear();
	});
</script>
<?php
	if(isset($_SERVER['Shib-Assertion-01']) && $_SERVER['Shib-Assertion-Count'] == '01') { // Shibboleth way
		$ch = curl_init($_SERVER['Shib-Assertion-01']);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_NOPROGRESS, TRUE);
		$assert = curl_exec($ch);
		if(!$assert) {
			echo "<div id='ssoalert' style='display:none;'><span><strong>Failed to fetch an assertion from Shibboleth: " . curl_error($ch) . "</strong></span></div>";
		}
		curl_close($ch);
	} elseif(isset($_SERVER['MELLON_SAML_RESPONSE'])) { // Mellon way
		$assert = base64_decode($_SERVER['MELLON_SAML_RESPONSE']);
		if(!$assert) {
			echo "<div id='ssoalert' style='display:none;'><span><strong>Failed to fetch an assertion from Mellon</strong></span></div>";
		}
	} else $assert = false;
	$conf = simplexml_load_file('config.xml');
	if($assert) {
		$sxml = new SimpleXMLElement($assert);
		//cho "<div id='ssoalert' style='display:none;'><span><strong>$assert</strong></span></div>";
		$sxml->registerXPathNamespace('saml2', 'urn:oasis:names:tc:SAML:2.0:assertion');
		$name = $sxml->xpath('//saml2:Assertion/saml2:AttributeStatement/saml2:Attribute[@Name="http://schemas.xmlsoap.org/claims/DisplayName"]/saml2:AttributeValue/text()');
		if($name[0]) {
			echo "<a class='button_log pull-right' id='ssologout' href='" . $conf->ssoLogout . "'><span class='glyphicon glyphicon-log-out' aria-hidden='true'> LogOut </span></a>";
			echo "<span class='button_log pull-right'>You are authenticated as <strong>$name[0]</strong></span>";
		} else {
			echo "<div id='ssoalert' style='display: none;'><span><strong>SSO response is not SAML2</strong></span></div>";
			echo "<a class='button_log pull-right' id='ssologin' href='" . $conf->ssoLogin . "'><span class='glyphicon glyphicon-log-in' aria-hidden='true'> LogIn </span></a>";
		}
	} else {
		echo "<a class='button_log pull-right' id='ssologin' href='" . $conf->ssoLogin . "'><span class='glyphicon glyphicon-log-in' aria-hidden='true'> LogIn </span></a>";
	}
?>
