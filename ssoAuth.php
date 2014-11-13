<?php
	if(isset($_SERVER['Shib-Assertion-01']) && $_SERVER['Shib-Assertion-Count'] == '01') { // Shibboleth way
		$ch = curl_init($_SERVER['Shib-Assertion-01']);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_NOPROGRESS, TRUE);
		$assert = curl_exec($ch);
		if(!$assert) {
			echo "<div id='sslalert'><span><strong>Failed to fetch an assertion from Shibboleth: " . curl_error($ch) . "</strong></span></div>";
		}
		curl_close($ch);
	} elseif(isset($_SERVER['MELLON_SAML_RESPONSE'])) { // Mellon way
		$assert = base64_decode($_SERVER['MELLON_SAML_RESPONSE']);
		if(!$assert) {
			echo "<div id='sslalert'><span><strong>Failed to fetch an assertion from Mellon</strong></span></div>";
		}
	} else $assert = false;

	if($assert) {
		$sxml = new SimpleXMLElement($assert);
		$sxml->registerXPathNamespace('saml2', 'urn:oasis:names:tc:SAML:2.0:assertion');
		$name = $sxml->xpath('//saml2:Assertion/saml2:AttributeStatement/saml2:Attribute[@Name="http://schemas.xmlsoap.org/claims/DisplayName"]/saml2:AttributeValue/text()');
		if($name[0]) {
			echo "<div id ='auth'><span>You are authenticated as <strong>$name[0]</strong></span></div>";
		} else {
			echo "<div id='sslalert'><span><strong>SSO response is not SAML2</strong></span></div>";
		}
	} else {
		echo "<div id ='auth'><span>You are not logged in SSO. <strong><a href=/sso/>Log In.</a></strong></span></div>";
	}
?>
