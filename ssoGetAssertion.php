<?php
	header('Content-Type: text/xml; charset=utf-8');
	if(isset($_SERVER['Shib-Assertion-01']) && $_SERVER['Shib-Assertion-Count'] == '01') { // Shibboleth way
		$ch = curl_init($_SERVER['Shib-Assertion-01']);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_NOPROGRESS, TRUE);
		$assert = curl_exec($ch);
		if(!$assert) {
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>Failed to fetch an assertion from Shibboleth: " . htmlspecialchars(curl_error($ch)) . "</error>";
		}
		curl_close($ch);
	} elseif(isset($_SERVER['MELLON_SAML_RESPONSE'])) { // Mellon way
		$assert = base64_decode($_SERVER['MELLON_SAML_RESPONSE']);
		if(!$assert) {
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>Failed to fetch an assertion from Mellon</error>";
		}
	} else $assert = false;

	if($assert) {
		$saml = simplexml_load_string($assert);
		$saml->registerXPathNamespace('saml2', 'urn:oasis:names:tc:SAML:2.0:assertion');
		$assert = $saml->xpath('//saml2:Assertion'); // Strip envelope if any
		if($assert[0]) {
			echo $assert[0]->asXML();
		} else {
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>SSO response is not SAML2</error>";
		}
	} else {
		echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>You are not logged in SSO</error>";
	}
?>
